import { SimplePaginator } from '@adonisjs/lucid/database'
import type { LucidModel, LucidRow, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { type SearchBuilder } from '../builder.js'
import { MagnifyEngine } from './main.js'
import type { SearchableModel, SearchableRow } from '../types.js'

/**
 * Database backed engine that resolves searches straight from the model's
 * table using Lucid. Indexing is a no-op since the source of truth is the DB.
 */
export class LucidEngine implements MagnifyEngine {
  async update(..._models: SearchableRow[]): Promise<void> {}

  async delete(..._models: SearchableRow[]): Promise<void> {}

  async flush(_model: SearchableModel): Promise<void> {}

  async get(builder: SearchBuilder): Promise<any[]> {
    return this.map(builder, await this.search(builder))
  }

  async search(builder: SearchBuilder): Promise<LucidRow[]> {
    const query = this.buildQuery(builder)

    if (builder.$limit !== undefined) {
      query.limit(builder.$limit)
    }

    return query.exec()
  }

  async map(_builder: SearchBuilder, results: LucidRow[]): Promise<LucidRow[]> {
    return results
  }

  async paginate(builder: SearchBuilder, perPage: number, page: number): Promise<SimplePaginator> {
    const paginator = await this.buildQuery(builder).paginate(page, perPage)

    return new SimplePaginator(paginator.total, perPage, page, ...paginator.all())
  }

  protected buildQuery(builder: SearchBuilder): ModelQueryBuilderContract<LucidModel> {
    const query = builder.$model.query()

    this.#applyTextConstraints(builder, query)
    this.#applyFilters(builder, query)
    this.#applyOrders(builder, query)

    return query
  }

  #applyTextConstraints(builder: SearchBuilder, query: ModelQueryBuilderContract<LucidModel>) {
    if (!builder.$query) {
      return
    }

    const columns = builder.$model.$searchableColumns ?? []
    const term = `%${builder.$query}%`

    const likeOperator = query.client.dialect.name === 'postgres' ? 'orWhereILike' : 'orWhereLike'

    query.where((group) => {
      for (const column of columns) {
        group[likeOperator](this.#column(builder, column), term)
      }
    })
  }

  #applyFilters(builder: SearchBuilder, query: ModelQueryBuilderContract<LucidModel>) {
    for (const [field, value] of Object.entries(builder.$wheres)) {
      query.where(this.#column(builder, field), value)
    }

    for (const [field, values] of Object.entries(builder.$whereIns)) {
      query.whereIn(this.#column(builder, field), values)
    }

    for (const [field, values] of Object.entries(builder.$whereNotIns)) {
      query.whereNotIn(this.#column(builder, field), values)
    }
  }

  #applyOrders(builder: SearchBuilder, query: ModelQueryBuilderContract<LucidModel>) {
    for (const order of builder.$orders) {
      query.orderBy(this.#column(builder, order.column), order.direction)
    }
  }

  #column(builder: SearchBuilder, field: string) {
    return builder.$model.$keys.attributesToColumns.get(field, field)
  }
}
