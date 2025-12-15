import {
  Config as MeilisearchClientConfig,
  Settings as MeilisearchIndexSettings,
} from 'meilisearch'
import { ConfigurationOptions as TypesenseClientOptions } from 'typesense/lib/Typesense/Configuration.js'
import { algoliasearch } from 'algoliasearch'
import { MagnifyManager } from './magnify_manager.js'
import { ConfigProvider } from '@adonisjs/core/types'
import { MagnifyEngine } from './engines/main.js'
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections.js'
import { LucidModel, LucidRow, ModelObject } from '@adonisjs/lucid/types/model'
import { SearchBuilder } from './builder.js'

export type MeilisearchConfig = MeilisearchClientConfig & {
  indexSettings?: Record<string, MeilisearchIndexSettings>
}

export type AlgoliaConfig = {
  appId: string
  apiKey: string
  options?: Parameters<typeof algoliasearch>[2]
}

export type TypesenseConfig = TypesenseClientOptions & {
  collectionSettings: Record<string, Omit<CollectionCreateSchema, 'name'> & { queryBy: string[] }>
}

export type ManagerEngineFactory = () => MagnifyEngine

export interface EnginesList {}
export type InferEngines<
  T extends ConfigProvider<{ engines: Record<string, ManagerEngineFactory> }>,
> = Awaited<ReturnType<T['resolver']>>['engines']

export interface MagnifyService extends MagnifyManager<
  EnginesList extends Record<string, ManagerEngineFactory> ? EnginesList : never
> {}

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    magnify: MagnifyService
  }
}

export interface SearchableRow extends LucidRow {
  /**
   * Get the value used to index the model.
   *
   * Defaults to `this.$primaryKeyValue`
   */
  get $searchKeyValue(): string | number

  /**
   * Get the indexable data array for the model.
   * Defaults to `model.serialize()`.
   */
  toSearchableObject(): ModelObject

  /**
   * Determine if the model should be searchable.
   *
   * Defaults to `true`
   */
  shouldBeSearchable(): boolean

  /**
   * Make this model searchable.
   */
  $makeSearchable(): Promise<void>

  /**
   * Remove the given model instance from the search index.
   */
  $makeUnsearchable(): Promise<void>
}

export interface SearchableModel extends Omit<LucidModel, 'constructor'> {
  /**
   * Get the index name for the model.
   */
  get $searchIndex(): string

  /**
   * Get the Magnify engine for the model.
   */
  $getSearchEngine(): Promise<MagnifyEngine>

  /**
   * Get the key name used to index the model.
   */
  get $searchKey(): string

  /**
   * When updating a model, this method determines if we should update the search index.
   */
  get $searchIndexShouldBeUpdated(): boolean

  /**
   * Perform a search against the model's indexed data.
   */
  search<Model extends SearchableModel>(this: Model, query: string): SearchBuilder<Model>

  /**
   * Make the given models searchable.
   */
  $makeSearchable<M extends SearchableModel>(this: M, ...models: InstanceType<M>[]): Promise<void>

  /**
   * Make the given models searchable.
   */
  $makeAllSearchable(chunk?: number): Promise<void>

  /**
   * Remove all instances of the model from the search index.
   */
  $removeAllFromSearch(): Promise<void>

  /**
   * Get a query builder for retrieving the requested models from an array of object IDs.
   */
  $queryMagnifyModelsByIds<M extends SearchableModel>(
    this: M,
    builder: SearchBuilder<M>,
    ...ids: string[]
  ): Promise<InstanceType<M>[]>

  new (): SearchableRow
}
