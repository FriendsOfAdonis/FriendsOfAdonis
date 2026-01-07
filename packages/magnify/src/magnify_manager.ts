import { RuntimeException } from '@adonisjs/core/exceptions'
import { type ManagerEngineFactory } from './types.js'

export class MagnifyManager<KnownEngines extends Record<string, ManagerEngineFactory>> {
  #cachedEngines: Map<keyof KnownEngines, ReturnType<KnownEngines[keyof KnownEngines]>> = new Map()

  constructor(public config: { default?: keyof KnownEngines; engines: KnownEngines }) {}

  /**
   * Use one of the registered engines.
   *
   * ```ts
   * manager.engine() // returns default engine
   * manager.engine('meilisearch')
   * ```
   */
  engine<EngineName extends keyof KnownEngines>(
    engine?: EngineName
  ): ReturnType<KnownEngines[EngineName]> {
    const engineToUse = (engine || this.config.default) as keyof KnownEngines
    if (!engineToUse) throw new RuntimeException('No search engine selected')

    /**
     * Check if the search engine was already instantiated
     */
    if (this.#cachedEngines.has(engineToUse)) {
      return this.#cachedEngines.get(engineToUse)!
    }

    /**
     * Otherwise create a new instance and cache it
     */
    const newEngine = this.config.engines[engineToUse]() as ReturnType<KnownEngines[EngineName]>
    this.#cachedEngines.set(engineToUse, newEngine)
    return newEngine
  }
}
