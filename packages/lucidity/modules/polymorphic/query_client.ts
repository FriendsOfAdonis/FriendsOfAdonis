import { managedTransaction } from '@adonisjs/lucid/utils'
import { type LucidModel, type LucidRow, type ModelObject } from '@adonisjs/lucid/types/model'
import { MorphQueryBuilder } from './query_builder.ts'
import { type MorphOneOrMany } from './morph_one_or_many.ts'

/**
 * Query client shared by `morphOne` and `morphMany`. It exposes the same
 * read/write surface as Lucid's `HasOneClientContract` (and, via the subclass,
 * `HasManyClientContract`), but every persisted row is hydrated with the morph
 * type and id columns through {@link MorphOneOrMany.hydrateForPersistance}.
 */
export class MorphOneOrManyClient {
  constructor(
    protected relation: MorphOneOrMany,
    protected parent: LucidRow,
    protected client: any
  ) {}

  protected static makeQuery(client: any, relation: MorphOneOrMany, rows: any) {
    const query = new MorphQueryBuilder(client.knexQuery(), client, rows, relation)
    if (typeof relation.onQueryHook === 'function') {
      relation.onQueryHook(query)
    }
    return query
  }

  /**
   * Returns an eager-load query builder (used by the Lucid preloader).
   */
  static eagerQuery(client: any, relation: MorphOneOrMany, rows: any) {
    const query = this.makeQuery(client, relation, rows)
    query.isRelatedPreloadQuery = true
    return query
  }

  /**
   * Returns a query builder scoped to the relationship.
   */
  query(): MorphQueryBuilder {
    return MorphOneOrManyClient.makeQuery(this.client, this.relation, this.parent)
  }

  /**
   * Persists the parent (if needed) and saves the related instance with the
   * morph columns set.
   */
  async save(related: LucidRow): Promise<void> {
    await managedTransaction(this.parent.$trx || this.client, async (trx) => {
      this.parent.$trx = trx
      await this.parent.save()
      this.relation.hydrateForPersistance(this.parent, related)
      related.$trx = trx
      await related.save()
    })
  }

  /**
   * Creates a new related instance with the morph columns set.
   */
  async create(values: ModelObject, options?: any): Promise<LucidRow> {
    return managedTransaction(this.parent.$trx || this.client, async (trx) => {
      this.parent.$trx = trx
      await this.parent.save()

      const valuesToPersist = Object.assign({}, values)
      this.relation.hydrateForPersistance(this.parent, valuesToPersist)

      return this.relation.relatedModel().create(valuesToPersist, { client: trx, ...options })
    })
  }

  /**
   * Returns the first matching related instance, or creates a new one.
   */
  async firstOrCreate(
    search: ModelObject,
    savePayload?: ModelObject,
    options?: any
  ): Promise<LucidRow> {
    return managedTransaction(this.parent.$trx || this.client, async (trx) => {
      this.parent.$trx = trx
      await this.parent.save()

      const valuesToPersist = Object.assign({}, search)
      this.relation.hydrateForPersistance(this.parent, valuesToPersist)

      return this.relation
        .relatedModel()
        .firstOrCreate(valuesToPersist, savePayload, { client: trx, ...options })
    })
  }

  /**
   * Updates the existing related instance, or creates a new one.
   */
  async updateOrCreate(
    search: ModelObject,
    updatePayload: ModelObject,
    options?: any
  ): Promise<LucidRow> {
    return managedTransaction(this.parent.$trx || this.client, async (trx) => {
      this.parent.$trx = trx
      await this.parent.save()

      const valuesToPersist = Object.assign({}, search)
      this.relation.hydrateForPersistance(this.parent, valuesToPersist)

      return this.relation
        .relatedModel()
        .updateOrCreate(valuesToPersist, updatePayload, { client: trx, ...options })
    })
  }
}

/**
 * Query client for `morphMany`. Adds the bulk write helpers.
 */
export class MorphManyClient extends MorphOneOrManyClient {
  /**
   * Saves many related instances.
   */
  async saveMany(related: LucidRow[]): Promise<void> {
    await managedTransaction(this.parent.$trx || this.client, async (trx) => {
      this.parent.$trx = trx
      await this.parent.save()

      for (const row of related) {
        this.relation.hydrateForPersistance(this.parent, row)
        row.$trx = trx
        await row.save()
      }
    })
  }

  /**
   * Creates many related instances.
   */
  async createMany(values: ModelObject[], options?: any): Promise<LucidRow[]> {
    return managedTransaction(this.parent.$trx || this.client, async (trx) => {
      this.parent.$trx = trx
      await this.parent.save()

      const valuesToPersist = values.map((value) => {
        const valueToPersist = Object.assign({}, value)
        this.relation.hydrateForPersistance(this.parent, valueToPersist)
        return valueToPersist
      })

      return (this.relation.relatedModel() as LucidModel).createMany(valuesToPersist, {
        client: trx,
        ...options,
      })
    })
  }
}
