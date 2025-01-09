import { RuntimeException } from '@adonisjs/core/exceptions'
import { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import { BaseModel } from '@adonisjs/lucid/orm'
import { ModelObject } from '@adonisjs/lucid/types/model'
import { Builder } from '../builder.js'
import magnify from '../../services/main.js'
import { MagnifyEngine } from '../engines/main.js'
import { SearchableModel } from '../types.js'

type Constructor = NormalizeConstructor<typeof BaseModel>

function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor
  }
}

export function Searchable<T extends Constructor>(superclass: T) {
  @staticImplements<SearchableModel>()
  class SearchableImpl extends superclass {
    /**
     * Get the Magnify engine for the model.
     */
    static get $searchEngine(): MagnifyEngine {
      return magnify.engine()
    }

    /**
     * Get the index name for the model.
     */
    static get $searchIndex(): string {
      return this.table
    }

    /**
     * Get the key name used to index the model.
     */
    static get $searchKey(): string {
      return this.primaryKey
    }

    /**
     * When updating a model, this method determines if we should update the search index.
     */
    static get $searchIndexShouldBeUpdated(): boolean {
      return true
    }

    /**
     * Perform a search against the model's indexed data.
     */
    static search<M extends SearchableModel>(this: M, query = ''): Builder<M> {
      return new Builder(this, query)
    }

    /**
     * Make the given models searchable.
     */
    static async $makeSearchable<M extends SearchableModel>(
      this: M,
      ...models: InstanceType<M>[]
    ): Promise<void> {
      await this.$searchEngine.update(...(models.filter((m) => m.shouldBeSearchable()) as any))
    }

    /**
     * Make the given models searchable.
     */
    static async $makeAllSearchable<M extends SearchableModel>(this: M, chunk = 100) {
      let pagination
      do {
        pagination = await this.query().paginate((pagination?.currentPage ?? 0) + 1, chunk)
        await this.$makeSearchable(...(pagination.values() as ArrayIterator<InstanceType<M>>))
      } while (pagination.hasMorePages)
    }

    /**
     * Remove all instances of the model from the search index.
     */
    static async $removeAllFromSearch(): Promise<void> {
      await this.$searchEngine.flush(this)
    }

    /**
     * Get a query builder for retrieving the requested models from an array of object IDs.
     */
    static $queryMagnifyModelsByIds<M extends SearchableModel>(
      this: M,
      _builder: Builder<M>,
      ...ids: string[]
    ): Promise<any[]> {
      const query = this.query()
      return query.whereIn(this.$searchKey, ids)
    }

    /**
     * Get the value used to index the model.
     *
     * Defaults to `this.$primaryKeyValue`
     */
    get $searchKeyValue(): string | number {
      if (!this.$primaryKeyValue) {
        throw new RuntimeException(
          'The model does not have any primary key value. You cannot index models that are not persisted.'
        )
      }

      return this.$primaryKeyValue
    }

    /**
     * Get the indexable data array for the model.
     * Defaults to `model.serialize()`.
     */
    toSearchableObject(): ModelObject {
      return this.serialize()
    }

    /**
     * Determine if the model should be searchable.
     *
     * Defaults to `true`
     */
    shouldBeSearchable(): boolean {
      return true
    }

    /**
     * Make this model searchable.
     */
    async $makeSearchable(): Promise<void> {
      SearchableImpl.$makeSearchable(this as any)
    }

    /**
     * Remove this model instance from the search index.
     */
    async $makeUnsearchable(): Promise<void> {
      await SearchableImpl.$searchEngine.delete(this)
    }
  }

  SearchableImpl.boot()

  SearchableImpl.after('create', async (model) => {
    await model.$makeSearchable()
  })

  SearchableImpl.after('update', async (model) => {
    await model.$makeSearchable()
  })

  SearchableImpl.after('delete', async (model) => {
    await model.$makeUnsearchable()
  })

  return SearchableImpl
}
