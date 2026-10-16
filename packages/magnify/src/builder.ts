import { type SimplePaginator } from '@adonisjs/lucid/database'
import { type MagnifyEngine } from './engines/main.js'
import { type SearchableModel } from './types.js'

export class SearchBuilder<Model extends SearchableModel = SearchableModel> {
  /**
   * The custom index specified for the search.
   */
  $index?: string

  /**
   * The query expression.
   */
  $query: string

  /**
   * The model instance.
   */
  $model: Model

  /**
   * The "where" constraints added to the query.
   */
  $wheres: Record<string, any> = {}

  /**
   * The "where in" constraints added to the query.
   */
  $whereIns: Record<string, any[]> = {}

  /**
   * The "where not in" constraints added to the query.
   */
  $whereNotIns: Record<string, any[]> = {}

  /**
   * The "limit" that should be applied to the search.
   */
  $limit?: number

  /**
   * The "order" that should be applied to the search.
   */
  $orders: { column: string; direction: 'asc' | 'desc' }[] = []

  constructor(model: any, query: string) {
    this.$model = model
    this.$query = query
  }

  /**
   * Specify a custom index to perform this search on.
   */
  within(index: string): this {
    this.$index = index
    return this
  }

  /**
   * Add a constraint to the search query.
   */
  where(field: string, value: any): this {
    this.$wheres[field] = value
    return this
  }

  /**
   * Add a "where in" constraint to the search query.
   */
  whereIn(field: string, values: any[]): this {
    this.$whereIns[field] = values
    return this
  }

  /**
   * Add a "where not in" constraint to the search query.
   */
  whereNotIn(field: string, values: any[]): this {
    this.$whereNotIns[field] = values
    return this
  }

  /**
   * Set the "limit" for the search query.
   */
  take(limit: number): this {
    this.$limit = limit
    return this
  }

  /**
   * Add an "order" for the search query.
   */
  orderBy(column: string, direction: 'asc' | 'desc') {
    this.$orders.push({
      column,
      direction,
    })

    return this
  }

  async paginate(perPage = 20, page = 1): Promise<SimplePaginator> {
    const engine = await this.$getEngine()
    return engine.paginate(this, perPage, page)
  }

  /**
   * Add an "order by" clause for a timestamp to the query.
   */
  latest(column = 'createdAt') {
    return this.orderBy(column, 'desc')
  }

  /**
   * Add an "order by" clause for a timestamp to the query.
   */
  oldest(column = 'createdAt') {
    return this.orderBy(column, 'asc')
  }

  $getEngine(): Promise<MagnifyEngine> {
    return this.$model.$getSearchEngine()
  }

  async get(): Promise<InstanceType<Model>[]> {
    const engine = await this.$getEngine()
    return engine.get(this)
  }
}
