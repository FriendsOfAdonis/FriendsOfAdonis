import { type MeilisearchConfig, type SearchableModel, type SearchableRow } from '../types.js'
import { MeiliSearch, type SearchParams, type SearchResponse } from 'meilisearch'
import { type SearchBuilder } from '../builder.js'
import { SimplePaginator } from '@adonisjs/lucid/database'
import { type MagnifyEngine } from './main.js'
import is from '@adonisjs/core/helpers/is'

export class MeilisearchEngine implements MagnifyEngine {
  #config: MeilisearchConfig

  readonly #client: MeiliSearch

  constructor(config: MeilisearchConfig) {
    this.#config = config
    this.#client = new MeiliSearch(config)
  }

  get client(): MeiliSearch {
    return this.#client
  }

  async update(...models: SearchableRow[]): Promise<void> {
    if (models.length <= 0) {
      return
    }

    const Static = models[0].constructor as SearchableModel

    const index = this.#client.index(Static.$searchIndex)

    const objects = models.map((model) => {
      const searchableData = model.toSearchableObject()

      return {
        ...searchableData,
        [Static.$searchKey]: model.$searchKeyValue,
      }
    })

    await index.addDocuments(objects, { primaryKey: Static.$searchKey })
  }

  async delete(...models: SearchableRow[]): Promise<void> {
    if (models.length <= 0) {
      return
    }

    const Static = models[0].constructor as SearchableModel

    const index = this.#client.index(Static.$searchIndex)

    const keys = models.map((model) => model.$searchKeyValue)

    await index.deleteDocuments(keys as string[] | number[])
  }

  async search<T extends Record<string, any> = Record<string, any>>(builder: SearchBuilder) {
    return this.#performSearch<T>(builder, {
      filter: this.#filters(builder),
      hitsPerPage: builder.$limit,
      sort: this.#buildSortFromOrderByClauses(builder),
    })
  }

  async paginate(builder: SearchBuilder, perPage: number, page: number) {
    const results = await this.#performSearch(builder, {
      hitsPerPage: perPage,
      page,
      sort: this.#buildSortFromOrderByClauses(builder),
    })

    return new SimplePaginator(
      results.hitsPerPage,
      perPage,
      page,
      ...(await this.map(builder, results))
    )
  }

  async flush(model: SearchableModel): Promise<void> {
    const index = this.#client.index(model.$searchIndex)
    await index.deleteAllDocuments()
  }

  async map<
    T extends Record<string, any> = Record<string, any>,
    S extends SearchParams = SearchParams,
  >(builder: SearchBuilder, results: SearchResponse<T, S>): Promise<any[]> {
    const ids = results.hits.map((hit) => hit[builder.$model.$searchKey])
    return builder.$model.$queryMagnifyModelsByIds(builder, ...ids)
  }

  async get(builder: SearchBuilder): Promise<any[]> {
    return this.map(builder, await this.search(builder))
  }

  async syncIndexSettings() {
    if (!this.#config.indexSettings) return
    for (const [name, settings] of Object.entries(this.#config.indexSettings)) {
      await this.#client.createIndex(name)
      await this.#client.index(name).updateSettings(settings)
    }
  }

  #filters(builder: SearchBuilder) {
    const filters = Object.entries(builder.$wheres).map(([key, value]) => {
      if (is.boolean(value)) {
        return `${key}=${value ? 'true' : 'false'}`
      }

      if (is.number(value)) {
        return `${key}=${value}`
      }

      return `${key}="${value}"`
    })

    for (const [operator, property] of [
      ['IN', builder.$whereIns],
      ['NOT IN', builder.$whereNotIns],
    ] as const) {
      for (const [key, values] of Object.entries(property)) {
        const filterValue = values
          .map((value) => {
            if (is.boolean(value)) {
              return value ? 'true' : 'false'
            }

            if (is.number(value)) {
              return value
            }

            return `"${value}"`
          })
          .join(', ')

        const filter = `${key} ${operator} [${filterValue}]`

        filters.push(filter)
      }
    }

    return filters.join(' AND ')
  }

  #buildSortFromOrderByClauses(builder: SearchBuilder): string[] {
    return builder.$orders.map((order) => `${order.column}:${order.direction}`)
  }

  #performSearch<
    T extends Record<string, any> = Record<string, any>,
    S extends SearchParams = SearchParams,
  >(builder: SearchBuilder, searchParams: S) {
    const index = this.#client.index<T>(builder.$index ?? builder.$model.$searchIndex)
    // TODO: Add builder options

    if (searchParams.attributesToRetrieve) {
      searchParams.attributesToRetrieve.unshift(builder.$model.$searchKey)
    }

    return index.search(builder.$query, searchParams)
  }
}
