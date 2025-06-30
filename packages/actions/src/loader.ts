import { CommandMetaData, LoadersContract } from '@adonisjs/core/types/ace'
import { fsReadAll, importDefault, slash } from '@poppinss/utils'
import { basename, extname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { AsCommand } from './base_action.js'
import { Constructor } from './types.js'
import { makeCommand } from './command_factory.js'
import { BaseCommand } from '@adonisjs/core/ace'

const JS_MODULES = ['.js', '.cjs', '.mjs']

export class ActionsLoader implements LoadersContract<typeof BaseCommand> {
  #actionsDirectory: string
  #commands: { command: typeof BaseCommand; filePath: string }[] = []

  constructor(actionsDirectory: string) {
    this.#actionsDirectory = actionsDirectory
  }

  async getCommand(metadata: CommandMetaData): Promise<typeof BaseCommand | null> {
    const entry = this.#commands.find((m) => m.filePath === metadata.filePath)
    if (!entry) return null
    return entry.command
  }

  async getMetaData(): Promise<CommandMetaData[]> {
    const actions = await this.#loadActions()

    this.#commands = Object.entries(actions).map(([filePath, Action]) => ({
      filePath,
      command: makeCommand(Action),
    }))

    return this.#commands.map((c) => ({
      ...c.command.serialize(),
      filePath: c.filePath,
    }))
  }

  async #loadActions() {
    const commands: Record<string, Constructor<AsCommand>> = {}

    const files = await fsReadAll(this.#actionsDirectory, {
      pathType: 'url',
      ignoreMissingRoot: true,
      filter: (filePath: string) => {
        const ext = extname(filePath)

        if (basename(filePath).startsWith('_')) return false
        if (JS_MODULES.includes(ext)) return true
        if (ext === '.ts' && !filePath.endsWith('.d.ts')) return true
        return false
      },
    })

    for (let file of files) {
      if (file.endsWith('.ts')) {
        file = file.replace(/\.ts$/, '.js')
      }

      const relativeFileName = slash(relative(this.#actionsDirectory, fileURLToPath(file)))

      commands[relativeFileName] = await importDefault<new () => AsCommand>(
        () => import(file),
        relativeFileName
      )
    }

    return commands
  }
}
