import { SimplePaginator } from '@adonisjs/lucid/database'
import { SearchBuilder } from '../builder.js'
import { AlgoliaConfig, SearchableModel, SearchableRow } from '../types.js'
import { MagnifyEngine } from './main.js'
import {
  algoliasearch,
  Algoliasearch,
  NumericFilters,
  SearchParams,
  SearchResponse,
} from 'algoliasearch'
import is from '@adonisjs/core/helpers/is'

export class AlgoliaEngine implements MagnifyEngine {
  readonly #client: Algoliasearch

  constructor(config: AlgoliaConfig) {
    this.#client = algoliasearch(config.appId, config.apiKey, config.options)
  }

  get client(): Algoliasearch {
    return this.#client
  }

  async update(...models: SearchableRow[]): Promise<void> {
    if (models.length <= 0) {
      return
    }

    const Static = models[0].constructor as SearchableModel

    const objects = models.map((model) => {
      const searchableData = model.toSearchableObject()

      return {
        ...searchableData,
        objectID: model.$searchKeyValue,
      }
    })

    await this.#client.saveObjects({
      indexName: Static.$searchIndex,
      objects: objects,
    })
  }

  async delete(...models: SearchableRow[]): Promise<void> {
    if (models.length <= 0) {
      return
    }

    const Static = models[0].constructor as SearchableModel
    const keys = models.map((model) => model.$searchKeyValue.toString())

    await this.#client.deleteObjects({ indexName: Static.$searchIndex, objectIDs: keys })
  }

  async search(builder: SearchBuilder): Promise<SearchResponse> {
    return this.#performSearch(builder, {
      numericFilters: this.#filters(builder),
      hitsPerPage: builder.$limit,
    })
  }

  map(builder: SearchBuilder, results: SearchResponse): Promise<any[]> {
    const ids = results.hits.map((hit) => hit.objectID)
    return builder.$model.$queryMagnifyModelsByIds(builder, ...ids)
  }

  async paginate(builder: SearchBuilder, perPage: number, page: number): Promise<SimplePaginator> {
    const results = await this.#performSearch(builder, {
      page: page - 1,
      hitsPerPage: perPage,
      numericFilters: this.#filters(builder),
    })

    return new SimplePaginator(
      results.nbHits ?? results.hits.length,
      perPage,
      page,
      ...(await this.map(builder, results))
    )
  }

  async flush(model: SearchableModel): Promise<void> {
    await this.#client.clearObjects({ indexName: model.$searchIndex })
  }

  async get(builder: SearchBuilder): Promise<any[]> {
    return this.map(builder, await this.search(builder))
  }

  #filters(builder: SearchBuilder): NumericFilters | undefined {
    const wheres = Object.entries(builder.$wheres).map(([key, value]) => {
      if (is.boolean(value)) return `${key} = ${value ? 1 : 0}`
      return `${key} = ${value}`
    })
    const whereIns = Object.entries(builder.$whereIns).map(([key, values]) => {
      if (values.length) {
        return '0 = 1'
      }

      return values.map((value) => {
        if (is.boolean(value)) return `${key} = ${value ? 1 : 0}`
        return `${key}:${value}`
      })
    })

    const filters = [...wheres, whereIns]

    return filters.length <= 0 ? undefined : filters
  }

  #performSearch(builder: SearchBuilder, params: SearchParams = {}) {
    return this.#client.searchSingleIndex({
      indexName: builder.$model.$searchIndex,
      searchParams: {
        query: builder.$query,
        ...params,
      },
    })
  }

  static configuration() {
    return {
      dependencies: ['algoliasearch'],
      variables: ['ALGOLIA_APP_ID', 'ALGOLIA_API_KEY'],
    }
  }
}
