/// <reference types="hot-hook/import-meta" />

import chokidar from 'chokidar'
import Hooks from '@poppinss/hooks'
import { fileURLToPath } from 'node:url'
import pm from 'picomatch'
import fg from 'fast-glob'

export interface AutoloaderOptions {
  path: string | URL
  glob: string | string[]
}

export type AutoloaderEvents = {
  loaded: [[path: string, module: any], []]
  unlink: [[path: string], []]
}

export class Autoloader {
  #matcher: pm.Matcher

  hooks = new Hooks<AutoloaderEvents>()

  constructor(public options: AutoloaderOptions) {
    this.#matcher = pm(options.glob, {
      cwd: fileURLToPath(this.options.path),
      basename: true,
    })
  }

  /**
   * Loads the module using the specifier.
   * When available, listen to hot-hook for module reloading on disposal.
   * Emits a `loaded` event.
   *
   * @example
   *
   * const module = await autoloader.load('path/to/module.ts')
   */
  async load(path: string) {
    const module = await import(path, import.meta.hot?.boundary)

    await this.hooks.runner('loaded').run(path, module)

    if (import.meta.hot) {
      const { hot } = await import('hot-hook')
      hot.dispose(`file://${path}`, () => {
        this.load(path)
      })
    }

    return module
  }

  /**
   * Discover files matching the autoloader matching options.
   *
   * @example
   *
   * const paths = autoloader.discover() // ['file1.ts', 'file2.ts']
   */
  async discover() {
    const cwd = fileURLToPath(this.options.path)

    return fg(this.options.glob, {
      cwd,
      dot: false,
      onlyFiles: true,
      absolute: true,
    })
  }

  /**
   * Autoload files matching the autoloader matching options.
   *
   * @example
   *
   * for await (const [path, module] of autoloader.discover()) {
   *  // Loaded modules
   * }
   */
  async *autoload() {
    for (const path of await this.discover()) {
      const module = await this.load(path)
      yield [path, module]
    }
  }

  /**
   * Starts the autoloader watcher.
   * Does not emit initial scan events.
   *
   * @example
   *
   * autoloader.hooks.add('loaded', (path, module) => {
   *   // Module has been added or reloaded
   * })
   *
   * autoloader.hooks.add('unlink', (path, module) => {
   *   // Module has been removed
   * })
   */
  async watch() {
    const watcher = chokidar.watch(fileURLToPath(this.options.path))

    await new Promise<void>((res) => watcher.once('ready', () => res()))

    watcher.on('add', this.#handleFileAdded.bind(this))
    watcher.on('unlink', this.#handleFileRemoved.bind(this))
  }

  #isMatch(path: string) {
    return this.#matcher(path)
  }

  async #handleFileAdded(relativePath: string) {
    const isMatch = this.#isMatch(relativePath)
    if (!isMatch) return
    const path = fileURLToPath(new URL(relativePath, this.options.path))

    const module = await this.load(path)
    this.hooks.runner('loaded').run(path, module)
  }

  async #handleFileRemoved(relativePath: string) {
    const isMatch = this.#isMatch(relativePath)
    if (!isMatch) return
    const path = fileURLToPath(new URL(relativePath, this.options.path))
    await this.hooks.runner('unlink').run(path)
  }
}
