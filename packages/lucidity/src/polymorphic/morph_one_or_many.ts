import { type LucidModel, type LucidRow, type ModelObject } from '@adonisjs/lucid/types/model'
import { resolveMorphType } from './morph_map.ts'
import { MorphTo } from './morph_to.ts'
import { MorphOneOrManyClient } from './query_client.ts'
import { type MorphOneOrManyOptions, type MorphQueryHook } from './types.ts'

/**
 * Base class shared by the `morphOne` and `morphMany` relationships.
 *
 * Both are a regular `hasOne` / `hasMany` constrained to rows whose polymorphic
 * `*_type` column equals this parent model's morph type. The relation duck-types
 * Lucid's relationship contract, so it plugs straight into the preloader, the
 * query builder and serialization.
 */
export abstract class MorphOneOrMany {
  abstract readonly type: 'hasOne' | 'hasMany'

  /**
   * Whether the relationship resolves to a single row (`morphOne`) or many
   * (`morphMany`).
   */
  abstract readonly single: boolean

  booted = false
  serializeAs: string | null
  onQueryHook?: MorphQueryHook

  /**
   * Polymorphic name (e.g. `imageable`).
   */
  morphName!: string

  /**
   * Attribute and column for the morph type on the related model.
   */
  morphTypeKey!: string
  morphTypeColumnName!: string

  /**
   * Attribute and column for the morph id (foreign key) on the related model.
   */
  morphForeignKey!: string
  morphForeignKeyColumnName!: string

  /**
   * Attribute and column for the local key on the parent model.
   */
  localKey!: string
  localKeyColumnName!: string

  /**
   * Value stored in the morph type column to identify this parent model.
   */
  morphValue!: string

  constructor(
    public relationName: string,
    public relatedModel: () => LucidModel,
    protected options: MorphOneOrManyOptions,
    public model: LucidModel
  ) {
    this.serializeAs = options.serializeAs === undefined ? relationName : options.serializeAs
    this.onQueryHook = options.onQuery
  }

  boot(): void {
    if (this.booted) {
      return
    }

    this.model.boot()
    const related = this.relatedModel()
    related.boot()

    this.morphName = this.options.morphName ?? this.inferMorphName(related)
    this.morphTypeKey = `${this.morphName}Type`
    this.morphForeignKey = `${this.morphName}Id`

    const typeColumn = related.$getColumn(this.morphTypeKey)
    if (!typeColumn) {
      throw new Error(
        `Polymorphic relationship "${this.model.name}.${this.relationName}" expects ` +
          `"${related.name}.${this.morphTypeKey}" to be a column. ` +
          `Add: @column() declare ${this.morphTypeKey}: string`
      )
    }

    const idColumn = related.$getColumn(this.morphForeignKey)
    if (!idColumn) {
      throw new Error(
        `Polymorphic relationship "${this.model.name}.${this.relationName}" expects ` +
          `"${related.name}.${this.morphForeignKey}" to be a column. ` +
          `Add: @column() declare ${this.morphForeignKey}: number`
      )
    }

    this.morphTypeColumnName = typeColumn.columnName
    this.morphForeignKeyColumnName = idColumn.columnName

    this.localKey = this.options.localKey ?? this.model.primaryKey
    const localColumn = this.model.$getColumn(this.localKey)
    if (!localColumn) {
      throw new Error(
        `Polymorphic relationship "${this.model.name}.${this.relationName}" expects ` +
          `"${this.model.name}.${this.localKey}" to be a column.`
      )
    }
    this.localKeyColumnName = localColumn.columnName

    this.morphValue = resolveMorphType(this.model)

    this.booted = true
  }

  /**
   * Infers the morph name from the related model's `morphTo` relationship that
   * points back to this model. This removes the need to repeat the morph name on
   * both sides of the relation.
   */
  protected inferMorphName(related: LucidModel): string {
    const candidates = new Set<string>()

    for (const definition of related.$relationsDefinitions.values()) {
      const relation: unknown = definition
      if (relation instanceof MorphTo && relation.includesModel(this.model)) {
        candidates.add(relation.morphName)
      }
    }

    if (candidates.size === 1) {
      return candidates.values().next().value!
    }

    const decorator = this.single ? 'morphOne' : 'morphMany'
    if (candidates.size === 0) {
      throw new Error(
        `Cannot infer the morph name for "${this.model.name}.${this.relationName}". ` +
          `The related model "${related.name}" has no matching "morphTo" relationship ` +
          `to infer it from. Pass it explicitly, e.g. ` +
          `@${decorator}(() => ${related.name}, 'taggable').`
      )
    }

    throw new Error(
      `Ambiguous morph name for "${this.model.name}.${this.relationName}": ` +
        `"${related.name}" defines several "morphTo" relationships matching it ` +
        `(${[...candidates].join(', ')}). Pass the name explicitly, e.g. ` +
        `@${decorator}(() => ${related.name}, '${[...candidates][0]}').`
    )
  }

  setRelated(parent: LucidRow, related: any): void {
    parent.$setRelated(this.relationName as never, related)
  }

  pushRelated(parent: LucidRow, related: any): void {
    parent.$pushRelated(this.relationName as never, related)
  }

  /**
   * Matches preloaded rows to their parents. Because the eager query is already
   * scoped to a single morph type, matching on the foreign key is enough.
   */
  setRelatedForMany(parents: LucidRow[], related: LucidRow[]): void {
    for (const parent of parents) {
      const localValue = (parent as any)[this.localKey]
      const matches = related.filter(
        (row) => localValue !== undefined && (row as any)[this.morphForeignKey] === localValue
      )
      this.setRelated(parent, this.single ? (matches[0] ?? null) : matches)
    }
  }

  eagerQuery(parent: LucidRow | LucidRow[], client: any) {
    this.boot()
    return MorphOneOrManyClient.eagerQuery(client, this, parent)
  }

  abstract client(parent: LucidRow, client: any): MorphOneOrManyClient

  subQuery(): never {
    throw new Error(
      `"has", "whereHas", "withCount" and friends are not supported for the polymorphic ` +
        `relationship "${this.model.name}.${this.relationName}". ` +
        `Query the "${this.morphTypeKey}" / "${this.morphForeignKey}" columns on ` +
        `"${this.relatedModel().name}" directly instead.`
    )
  }

  /**
   * Sets the morph id and type columns on a row before it is persisted.
   */
  hydrateForPersistance(parent: LucidRow, values: LucidRow | ModelObject): void {
    const localValue = (parent as any)[this.localKey]
    if (localValue === null || localValue === undefined) {
      throw new Error(
        `Cannot persist "${this.relationName}", ` +
          `value of "${this.model.name}.${this.localKey}" is ${localValue}`
      )
    }

    ;(values as any)[this.morphForeignKey] = localValue
    ;(values as any)[this.morphTypeKey] = this.morphValue
  }

  abstract clone(model: LucidModel): MorphOneOrMany
}
