import { configProvider } from '@adonisjs/core'
import { type ConfigProvider } from '@adonisjs/core/types'
import {
  type AlgoliaConfig,
  type ManagerEngineFactory,
  type MeilisearchConfig,
  type TypesenseConfig,
} from './types.js'
import { InvalidArgumentsException } from '@adonisjs/core/exceptions'
import type { MeilisearchEngine } from './engines/meilisearch.js'
import type { TypesenseEngine } from './engines/typesense.js'
import type { AlgoliaEngine } from './engines/algolia.js'

type ResolvedConfig<
  KnownEngines extends Record<string, ManagerEngineFactory | ConfigProvider<ManagerEngineFactory>>,
> = {
  default?: keyof KnownEngines
  engines: {
    [K in keyof KnownEngines]: KnownEngines[K] extends ConfigProvider<infer A> ? A : KnownEngines[K]
  }
}

export function defineConfig<
  KnownEngines extends Record<string, ManagerEngineFactory | ConfigProvider<ManagerEngineFactory>>,
>(config: {
  default?: keyof KnownEngines
  engines: KnownEngines
}): ConfigProvider<ResolvedConfig<KnownEngines>> {
  if (!config.engines) {
    throw new InvalidArgumentsException('Missing "engines" property in magnify config')
  }

  if (config.default && !config.engines[config.default]) {
    throw new InvalidArgumentsException(
      `Missing "engines.${String(config.default)} in magnify config. It is referenced by the "default" property`
    )
  }

  return configProvider.create<ResolvedConfig<KnownEngines>>(async (app) => {
    const enginesList = Object.keys(config.engines)
    const engines = {} as Record<
      string,
      ManagerEngineFactory | ConfigProvider<ManagerEngineFactory>
    >

    for (const engineName of enginesList) {
      const engine = config.engines[engineName]
      if (typeof engine === 'function') {
        engines[engineName] = engine
      } else {
        engines[engineName] = await engine.resolver(app)
      }
    }

    return {
      default: config.default,
      engines: engines as ResolvedConfig<KnownEngines>['engines'],
    }
  })
}

export const engines: {
  meilisearch: (config: MeilisearchConfig) => ConfigProvider<() => MeilisearchEngine>
  typesense: (config: TypesenseConfig) => ConfigProvider<() => TypesenseEngine>
  algolia: (config: AlgoliaConfig) => ConfigProvider<() => AlgoliaEngine>
} = {
  meilisearch: (config) => {
    return configProvider.create(async () => {
      const { MeilisearchEngine } = await import('./engines/meilisearch.js')
      return () => new MeilisearchEngine(config)
    })
  },
  typesense: (config) => {
    return configProvider.create(async () => {
      const { TypesenseEngine } = await import('./engines/typesense.js')
      return () => new TypesenseEngine(config)
    })
  },
  algolia: (config) => {
    return configProvider.create(async () => {
      const { AlgoliaEngine } = await import('./engines/algolia.js')
      return () => new AlgoliaEngine(config)
    })
  },
}
