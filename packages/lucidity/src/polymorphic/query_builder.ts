import { ModelQueryBuilder } from '@adonisjs/lucid/orm'
import { unique } from '@adonisjs/lucid/utils'
import { type MorphOneOrMany } from './morph_one_or_many.ts'

/**
 * Query builder shared by `morphOne` and `morphMany`.
 *
 * It behaves like Lucid's `HasOne` / `HasMany` query builders but adds the
 * polymorphic type constraint (`*_type = morphValue`) on top of the foreign key
 * constraint (`*_id = localKey`). A single class covers both relations: the
 * `relation.single` flag decides whether a `LIMIT 1` is applied.
 */
export class MorphQueryBuilder extends ModelQueryBuilder {
  /**
   * Whether this query is being used to eager load the relationship.
   */
  isRelatedPreloadQuery = false

  /**
   * Guards against applying the relation constraints more than once.
   */
  protected appliedConstraints = false

  constructor(
    builder: any,
    client: any,
    protected parent: any | any[],
    public relation: MorphOneOrMany
  ) {
    super(builder, relation.relatedModel(), client, (userFn: any) => {
      return ($builder: any) => {
        const subQuery = new MorphQueryBuilder($builder, this.client, this.parent, this.relation)
        subQuery.isChildQuery = true
        subQuery.isRelatedPreloadQuery = this.isRelatedPreloadQuery
        userFn(subQuery)
        subQuery.applyWhere()
      }
    })
  }

  get isRelatedQuery(): boolean {
    return true
  }

  get isRelatedSubQuery(): boolean {
    return false
  }

  /**
   * Reads the currently selected columns from the underlying knex query.
   */
  protected getSelectedColumns(): { value: string[] } | undefined {
    return (this.knexQuery as any)['_statements'].find(
      ({ grouping }: { grouping: string }) => grouping === 'columns'
    )
  }

  /**
   * Returns the query action ('select' | 'preload' | 'update' | 'delete'), used
   * to build descriptive error messages and to decide whether to apply a limit.
   */
  protected queryAction(): string {
    const method = (this.knexQuery as any)['_method'] as string | undefined
    if (method === 'del') return 'delete'
    if (method === 'select' && this.isRelatedPreloadQuery) return 'preload'
    return method ?? 'select'
  }

  /**
   * Ensures the morph id column is always selected so that
   * {@link MorphOneOrMany.setRelatedForMany} can match rows to their parent.
   */
  selectRelationKeys(): this {
    const columns = this.getSelectedColumns()
    if (!columns) {
      return this
    }

    const key = this.resolveKey(this.relation.morphForeignKey)
    if (!columns.value.includes(key)) {
      columns.value.push(key)
    }

    return this
  }

  /**
   * Applies the WHERE conditions that scope this query to the relationship.
   */
  applyConstraints(): void {
    if (this.appliedConstraints) {
      return
    }
    this.appliedConstraints = true

    const action = this.queryAction()
    const { morphTypeColumnName, morphValue, morphForeignKeyColumnName, localKey } = this.relation

    if (Array.isArray(this.parent)) {
      const ids = unique(
        this.parent.map((row) => {
          const value = row[localKey]
          if (value === undefined) {
            throw new Error(
              `Cannot preload "${this.relation.relationName}", ` +
                `value of "${this.relation.model.name}.${localKey}" is undefined`
            )
          }
          return value
        })
      )

      this.wrapExisting()
        .where(morphTypeColumnName, morphValue)
        .whereIn(morphForeignKeyColumnName, ids)
      return
    }

    const value = this.parent[localKey]
    if (value === undefined) {
      throw new Error(
        `Cannot ${action} "${this.relation.relationName}", ` +
          `value of "${this.relation.model.name}.${localKey}" is undefined`
      )
    }

    this.wrapExisting()
      .where(morphTypeColumnName, morphValue)
      .where(morphForeignKeyColumnName, value)

    if (this.relation.single && !['update', 'delete'].includes(action)) {
      this.limit(1)
    }
  }

  clone(): this {
    const cloned = new MorphQueryBuilder(
      this.knexQuery.clone(),
      this.client,
      this.parent,
      this.relation
    )
    cloned.appliedConstraints = this.appliedConstraints
    cloned.isRelatedPreloadQuery = this.isRelatedPreloadQuery
    this.applyQueryFlags(cloned)
    return cloned as this
  }

  paginate(page: number, perPage: number = 20): any {
    if (this.relation.single) {
      throw new Error(
        `Cannot paginate a "morphOne" relationship "(${this.relation.relationName})"`
      )
    }
    if (this.isRelatedPreloadQuery) {
      throw new Error(
        `Cannot paginate relationship "${this.relation.relationName}" during preload`
      )
    }
    this.applyConstraints()
    return super.paginate(page, perPage)
  }

  getGroupLimitQuery(): never {
    throw new Error(
      `Cannot apply groupLimit on the polymorphic relationship "(${this.relation.relationName})"`
    )
  }

  toKnex(): any {
    this.applyConstraints()
    return super.toKnex()
  }

  toSQL(): any {
    this.applyConstraints()
    return super.toSQL()
  }

  toQuery(): string {
    this.applyConstraints()
    return super.toQuery()
  }

  exec(): any {
    this.applyConstraints()
    return super.exec()
  }

  first(): any {
    this.applyConstraints()
    return super.first()
  }
}
