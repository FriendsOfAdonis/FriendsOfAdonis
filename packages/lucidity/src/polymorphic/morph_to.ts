import { managedTransaction } from '@adonisjs/lucid/utils'
import { type LucidModel, type LucidRow } from '@adonisjs/lucid/types/model'
import { resolveMorphType } from './morph_map.ts'
import { type MorphToOptions } from './types.ts'

/**
 * Symbol used to tag preloaded rows with the morph type they were resolved for,
 * so {@link MorphTo.setRelatedForMany} can match them back to the right parent
 * without polluting the model attributes or `$extras`.
 */
const MORPH_TYPE = Symbol('lucidity.morph_to.type')

/**
 * Recorded preload-callback operations whose first argument is a relation name.
 * They are skipped on per-type queries whose model does not define the relation,
 * so a nested preload that only applies to some candidate types degrades
 * gracefully instead of throwing.
 */
const RELATION_OPS = new Set([
  'preload',
  'preloadOnce',
  'load',
  'withCount',
  'withAggregate',
  'has',
  'orHas',
  'whereHas',
  'orWhereHas',
  'doesntHave',
  'orDoesntHave',
  'whereDoesntHave',
  'orWhereDoesntHave',
])

/**
 * `morphTo` relationship: the child model belongs to one of several parent
 * models, picked at runtime from its `*_type` column.
 *
 * Unlike a `belongsTo`, there is no single related model, so this relation
 * resolves a list of candidate models (`() => [Post, Video]`) and maps each one
 * to its {@link resolveMorphType morph type} on both read and write.
 *
 * @example
 * ```ts
 * // images: id, url, imageable_type, imageable_id
 * class Image extends BaseModel {
 *   \@column() declare imageableType: string
 *   \@column() declare imageableId: number
 *
 *   \@morphTo(() => [Post, Video])
 *   declare imageable: MorphTo<[typeof Post, typeof Video]> | null
 * }
 * ```
 */
export class MorphTo {
  readonly type = 'belongsTo' as const

  booted = false
  serializeAs: string | null
  onQueryHook?: (query: any) => void

  /**
   * Polymorphic name (e.g. `imageable`). Defaults to the relationship name.
   */
  morphName: string

  /**
   * Attribute and column for the morph type on this (child) model.
   */
  morphTypeKey!: string
  morphTypeColumnName!: string

  /**
   * Attribute and column for the morph id on this (child) model.
   */
  morphForeignKey!: string
  morphForeignKeyColumnName!: string

  private typeToModel = new Map<string, LucidModel>()
  private modelToType = new Map<LucidModel, string>()

  constructor(
    public relationName: string,
    public models: () => LucidModel[],
    protected options: MorphToOptions,
    public model: LucidModel
  ) {
    this.serializeAs = options.serializeAs === undefined ? relationName : options.serializeAs
    this.onQueryHook = options.onQuery
    this.morphName = options.morphName ?? relationName
  }

  /**
   * The related model is dynamic, so this is intentionally unavailable.
   */
  relatedModel(): never {
    throw new Error(
      `"relatedModel()" is not available on the morphTo relationship ` +
        `"${this.model.name}.${this.relationName}": its target is resolved at runtime.`
    )
  }

  clone(model: LucidModel): MorphTo {
    return new MorphTo(this.relationName, this.models, { ...this.options }, model)
  }

  boot(): void {
    if (this.booted) {
      return
    }

    this.model.boot()

    this.morphTypeKey = `${this.morphName}Type`
    this.morphForeignKey = `${this.morphName}Id`

    const typeColumn = this.model.$getColumn(this.morphTypeKey)
    if (!typeColumn) {
      throw new Error(
        `Polymorphic relationship "${this.model.name}.${this.relationName}" expects ` +
          `"${this.model.name}.${this.morphTypeKey}" to be a column. ` +
          `Add: @column() declare ${this.morphTypeKey}: string`
      )
    }

    const idColumn = this.model.$getColumn(this.morphForeignKey)
    if (!idColumn) {
      throw new Error(
        `Polymorphic relationship "${this.model.name}.${this.relationName}" expects ` +
          `"${this.model.name}.${this.morphForeignKey}" to be a column. ` +
          `Add: @column() declare ${this.morphForeignKey}: number`
      )
    }

    this.morphTypeColumnName = typeColumn.columnName
    this.morphForeignKeyColumnName = idColumn.columnName

    for (const related of this.models()) {
      related.boot()
      const morphType = resolveMorphType(related)
      this.typeToModel.set(morphType, related)
      this.modelToType.set(related, morphType)
    }

    this.booted = true
  }

  /**
   * Whether the given model is one of this relation's candidate parents. Used by
   * `morphOne` / `morphMany` to infer their morph name.
   */
  includesModel(model: LucidModel): boolean {
    return this.models().includes(model)
  }

  /**
   * Resolves the candidate model registered for a morph type value.
   */
  resolveModelForType(morphType: string): LucidModel | undefined {
    this.boot()
    return this.typeToModel.get(morphType)
  }

  /**
   * Resolves the morph type value for one of the candidate models.
   */
  resolveTypeForModel(model: LucidModel): string | undefined {
    this.boot()
    return this.modelToType.get(model)
  }

  setRelated(parent: LucidRow, related: any): void {
    parent.$setRelated(this.relationName as never, related ?? null)
  }

  pushRelated(parent: LucidRow, related: any): void {
    parent.$pushRelated(this.relationName as never, related ?? null)
  }

  setRelatedForMany(parents: LucidRow[], related: LucidRow[]): void {
    for (const parent of parents) {
      const morphType = (parent as any)[this.morphTypeKey]
      const morphId = (parent as any)[this.morphForeignKey]

      if (morphType === null || morphType === undefined || morphId === null || morphId === undefined) {
        this.setRelated(parent, null)
        continue
      }

      const match = related.find((row) => {
        const RelatedModel = row.constructor as LucidModel
        // Loose equality: morph id columns are often strings while primary keys
        // are numbers (and vice versa).
        // eslint-disable-next-line eqeqeq
        return (row as any)[MORPH_TYPE] === morphType && (row as any)[RelatedModel.primaryKey] == morphId
      })

      this.setRelated(parent, match ?? null)
    }
  }

  client(parent: LucidRow, client: any): MorphToClient {
    this.boot()
    return new MorphToClient(this, parent, client)
  }

  eagerQuery(parent: LucidRow | LucidRow[], client: any) {
    this.boot()
    const parents = Array.isArray(parent) ? parent : [parent]
    return new MorphToEagerQuery(this, parents, client)
  }

  subQuery(): never {
    throw new Error(
      `"has", "whereHas", "withCount" and friends are not supported for the polymorphic ` +
        `relationship "${this.model.name}.${this.relationName}" (its target table is dynamic). ` +
        `Filter on the "${this.morphName}Type" / "${this.morphName}Id" columns directly instead.`
    )
  }

  /**
   * The child model owns the foreign key columns; they are set through
   * {@link MorphToClient.associate}, never through a parent's persistence.
   */
  hydrateForPersistance(): void {}
}

/**
 * Query client for `morphTo`. Resolves the related model from the parent's
 * current morph type, and exposes `associate` / `dissociate`.
 */
export class MorphToClient {
  constructor(
    private relation: MorphTo,
    private parent: LucidRow,
    private client: any
  ) {}

  /**
   * Returns a query builder scoped to the currently referenced parent.
   */
  query(): any {
    const morphType = (this.parent as any)[this.relation.morphTypeKey]
    const morphId = (this.parent as any)[this.relation.morphForeignKey]

    if (morphType === null || morphType === undefined || morphId === null || morphId === undefined) {
      throw new Error(
        `Cannot query "${this.relation.relationName}": ` +
          `"${this.relation.model.name}.${this.relation.morphTypeKey}" and ` +
          `"${this.relation.model.name}.${this.relation.morphForeignKey}" must both be set.`
      )
    }

    const RelatedModel = this.relation.resolveModelForType(morphType)
    if (!RelatedModel) {
      throw new Error(unknownTypeMessage(this.relation, morphType))
    }

    const query = RelatedModel.query({ client: this.client }).where(RelatedModel.primaryKey, morphId)
    if (typeof this.relation.onQueryHook === 'function') {
      this.relation.onQueryHook(query)
    }
    return query
  }

  /**
   * Points this model at a parent instance by setting the morph columns and
   * persisting.
   */
  async associate(related: LucidRow): Promise<void> {
    const RelatedModel = related.constructor as LucidModel
    const morphType = this.relation.resolveTypeForModel(RelatedModel)

    if (!morphType) {
      throw new Error(
        `Cannot associate "${RelatedModel.name}" with "${this.relation.relationName}": ` +
          `it is not one of the candidate models of the morphTo relationship.`
      )
    }

    await managedTransaction(this.parent.$trx || this.client, async (trx) => {
      // Persist the related row first so its primary key is available, mirroring
      // Lucid's belongsTo associate().
      related.$trx = trx
      await related.save()

      const relatedKey = (related as any)[RelatedModel.primaryKey]
      if (relatedKey === null || relatedKey === undefined) {
        throw new Error(
          `Cannot associate "${RelatedModel.name}" with "${this.relation.relationName}": ` +
            `its primary key "${RelatedModel.primaryKey}" is not set.`
        )
      }

      ;(this.parent as any)[this.relation.morphTypeKey] = morphType
      ;(this.parent as any)[this.relation.morphForeignKey] = relatedKey
      this.parent.$trx = trx
      await this.parent.save()
    })

    this.parent.$setRelated(this.relation.relationName as never, related)
  }

  /**
   * Clears the parent reference by nulling the morph columns and persisting.
   */
  async dissociate(): Promise<void> {
    await managedTransaction(this.parent.$trx || this.client, async (trx) => {
      ;(this.parent as any)[this.relation.morphTypeKey] = null
      ;(this.parent as any)[this.relation.morphForeignKey] = null
      this.parent.$trx = trx
      await this.parent.save()
    })

    this.parent.$setRelated(this.relation.relationName as never, null)
  }
}

/**
 * Eager loader for `morphTo`.
 *
 * A single SQL query cannot cover parents pointing at different tables, so this
 * loader groups parents by morph type, runs one query per type, and tags each
 * result with the {@link MORPH_TYPE} symbol for matching.
 *
 * The object is returned to the Lucid preloader, which calls `.debug()`,
 * `.sideload()`, the user preload callback and `.selectRelationKeys()` on it.
 * Those calls are recorded and replayed on every per-type query, so nested
 * preloads and extra constraints work across all candidate models.
 */
export class MorphToEagerQuery {
  isRelatedPreloadQuery = true

  private recordedOps: Array<[string, unknown[]]> = []

  constructor(
    private relation: MorphTo,
    private parents: LucidRow[],
    private client: any
  ) {
    return new Proxy(this, {
      get(target, property, receiver) {
        if (property in target) {
          return Reflect.get(target, property, receiver)
        }
        if (typeof property !== 'string') {
          return undefined
        }
        return (...args: unknown[]) => {
          target.recordedOps.push([property, args])
          return receiver
        }
      },
    })
  }

  selectRelationKeys(): this {
    // The primary key is always selected by the per-type model queries.
    return this
  }

  async exec(): Promise<LucidRow[]> {
    const { relation } = this

    const idsByType = new Map<string, Set<any>>()
    for (const parent of this.parents) {
      const morphType = (parent as any)[relation.morphTypeKey]
      const morphId = (parent as any)[relation.morphForeignKey]
      if (morphType === null || morphType === undefined || morphId === null || morphId === undefined) {
        continue
      }
      let ids = idsByType.get(morphType)
      if (!ids) {
        ids = new Set()
        idsByType.set(morphType, ids)
      }
      ids.add(morphId)
    }

    const related: LucidRow[] = []

    for (const [morphType, idSet] of idsByType) {
      const RelatedModel = relation.resolveModelForType(morphType)
      // Unknown morph type: the affected parents simply resolve to `null`.
      if (!RelatedModel) {
        continue
      }

      const query: any = RelatedModel.query({ client: this.client })
      query.whereIn(RelatedModel.primaryKey, [...idSet])

      if (typeof relation.onQueryHook === 'function') {
        relation.onQueryHook(query)
      }

      for (const [method, args] of this.recordedOps) {
        // Skip a nested relation op when this candidate model does not define
        // the relation, so mixed-type morphTo preloads degrade gracefully.
        if (RELATION_OPS.has(method) && typeof args[0] === 'string' && !RelatedModel.$hasRelation(args[0])) {
          continue
        }
        const fn = (query as any)[method]
        if (typeof fn === 'function') {
          fn.apply(query, args)
        }
      }

      // Ensure the primary key is selected so rows can be matched back to their
      // parent, even when the user narrowed the columns through the preload
      // callback (mirrors Lucid's `selectRelationKeys`).
      const selected = (query.knexQuery as any)['_statements'].find(
        ({ grouping }: { grouping: string }) => grouping === 'columns'
      )
      if (selected) {
        const pkColumn = RelatedModel.$getColumn(RelatedModel.primaryKey)?.columnName
        if (!selected.value.includes(pkColumn) && !selected.value.includes(RelatedModel.primaryKey)) {
          query.select(RelatedModel.primaryKey)
        }
      }

      const rows = await query.exec()
      for (const row of rows) {
        ;(row as any)[MORPH_TYPE] = morphType
        related.push(row)
      }
    }

    return related
  }
}

function unknownTypeMessage(relation: MorphTo, morphType: string): string {
  const known = [...(relation as any).typeToModel.keys()]
  return (
    `Unknown morph type "${morphType}" for the relationship ` +
    `"${relation.model.name}.${relation.relationName}". ` +
    `Known types: ${known.length ? known.map((t) => `"${t}"`).join(', ') : '(none)'}. ` +
    `Make sure the parent model is listed in morphTo(() => [...]).`
  )
}
