import { SimplePaginator } from '@adonisjs/lucid/database'
import { type SearchBuilder } from '../builder.js'
import { MagnifyEngine } from './main.js'
import type { SearchableModel, SearchableRow } from '../types.js'

/**
 * Null engine to be used in development and testing environments.
 */
export class NoopEngine extends MagnifyEngine {
  async update(..._models: SearchableRow[]): Promise<void> {}

  async delete(..._models: SearchableRow[]): Promise<void> {}

  async search(_builder: SearchBuilder): Promise<any[]> {
    return []
  }

  async map(_builder: SearchBuilder, _results: any): Promise<any[]> {
    return []
  }

  async paginate(_builder: SearchBuilder, perPage: number, page: number): Promise<SimplePaginator> {
    return new SimplePaginator(0, perPage, page)
  }

  async flush(_model: SearchableModel): Promise<void> {}
}
