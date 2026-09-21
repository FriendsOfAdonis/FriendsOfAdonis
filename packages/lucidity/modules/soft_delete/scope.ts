import { ModelQueryBuilder } from '@adonisjs/lucid/orm'
import type { LucidModel } from '@adonisjs/lucid/types/model'

/**
 * Marker set by the `SoftDeletable` mixin on the models it decorates.
 */
export const SOFT_DELETABLE = Symbol('lucidity.soft_deletable')

/**
 * A where clause as recorded in the where stack of a Lucid query builder.
 */
type WhereNode = {
  /**
   * Name of the knex method applying the clause.
   */
  method: string

  /**
   * Arguments given to the knex method.
   */
  args: unknown[]
}

/**
 * A where clause of the soft delete scope.
 */
type ScopeClause = {
  /**
   * Name of the knex method applying the clause.
   */
  method: 'whereNull' | 'whereNotNull'

  /**
   * The "deleted_at" column, prefixed with its table or alias.
   */
  column: string
}

/**
 * The table in the FROM clause of a query.
 */
type FromTable = {
  /**
   * Name of the table.
   */
  table: string

  /**
   * Alias prefixing the columns of the table, which is the table name
   * itself when the table is not aliased.
   */
  alias: string
}

/**
 * The runtime shape of a has many through relationship, which the public
 * relationship contract does not fully expose.
 */
type ThroughRelation = {
  /**
   * The type of the relationship.
   */
  type: 'hasManyThrough'

  /**
   * Returns the model of the through table.
   */
  throughModel: () => LucidModel
}

/**
 * The internals of a model query builder read while compiling the scope.
 */
type QueryInternals = {
  /**
   * Where clauses of the query, one collection per group.
   */
  whereStack: WhereNode[][]

  /**
   * Whether the query is the builder of a where callback.
   */
  isChildQuery: boolean

  /**
   * The relationship the query belongs to, when it is a relationship query.
   */
  relation?: { type: string }
}

/**
 * Returns the internals of the given query builder.
 */
function internals(query: ModelQueryBuilder): QueryInternals {
  return query as unknown as QueryInternals
}

/**
 * Returns whether the given model uses the `SoftDeletable` mixin.
 */
export function isSoftDeletable(model: LucidModel): boolean {
  return (model as any)[SOFT_DELETABLE] === true
}

/**
 * Returns whether the given query belongs to a has many through relationship.
 */
export function isThroughQuery(query: ModelQueryBuilder): boolean {
  return internals(query).relation?.type === 'hasManyThrough'
}

/**
 * Returns the table in the FROM clause of the given knex query. Returns
 * `null` when the query selects from a subquery or a raw expression.
 */
function resolveFrom(knexQuery: any): FromTable | null {
  const table = knexQuery._single.table

  if (typeof table === 'string') {
    const [name, alias] = table.split(/\s+as\s+/i)
    return { table: name.trim(), alias: (alias ?? name).trim() }
  }

  /**
   * Knex accepts an alias as an object, as in `from({ alias: 'table' })`
   */
  if (table && typeof table === 'object' && typeof table.toSQL !== 'function') {
    const entries = Object.entries(table)
    if (entries.length === 1 && typeof entries[0][1] === 'string') {
      return { table: entries[0][1], alias: entries[0][0] }
    }
  }

  return null
}

/**
 * Returns whether the given knex query joins the given table.
 */
function joinsTable(knexQuery: any, table: string): boolean {
  return knexQuery._statements.some(
    (statement: any) => statement.grouping === 'join' && statement.table === table
  )
}

/**
 * Returns the through model of the has many through relationship the given
 * query belongs to, when it is soft deletable.
 */
function softDeletableThroughModel(query: ModelQueryBuilder): LucidModel | null {
  if (!isThroughQuery(query)) return null

  const throughModel = (internals(query).relation as ThroughRelation).throughModel()
  return isSoftDeletable(throughModel) ? throughModel : null
}

/**
 * Returns the where clauses hiding the trashed rows the given query reads or
 * writes, according to the mode chosen with `withTrashed()`, `onlyTrashed()`
 * and `withTrashedParents()`.
 */
function scopeClauses(query: ModelQueryBuilder): ScopeClause[] {
  const clauses: ScopeClause[] = []
  const from = resolveFrom(query.knexQuery)
  if (!from) return clauses

  /**
   * Where callbacks are grouped inside their parent query, which applies the
   * scope once for the whole group
   */
  if (internals(query).isChildQuery) return clauses

  if (
    from.table === query.model.table &&
    isSoftDeletable(query.model) &&
    query.trashedMode !== 'with'
  ) {
    clauses.push({
      method: query.trashedMode === 'only' ? 'whereNotNull' : 'whereNull',
      column: `${from.alias}.${query.model.$getColumn('deletedAt')!.columnName}`,
    })
  }

  /**
   * Has many through queries join the through table, whose trashed rows
   * hide the related rows they lead to
   */
  const throughModel = softDeletableThroughModel(query)
  if (
    throughModel &&
    !query.includeTrashedParents &&
    joinsTable(query.knexQuery, throughModel.table)
  ) {
    clauses.push({
      method: 'whereNull',
      column: `${throughModel.table}.${throughModel.$getColumn('deletedAt')!.columnName}`,
    })
  }

  return clauses
}

/**
 * Applies the where clauses of a query builder. Defined by the Lucid
 * `Chainable` class and invoked every time the query is compiled.
 */
const lucidApplyWhere: () => void = (ModelQueryBuilder.prototype as any).applyWhere

/**
 * Applies the soft delete scope every time a model query is compiled, so
 * executed queries, `pojo()` queries and relationship subqueries all hide the
 * trashed rows.
 */
;(ModelQueryBuilder.prototype as any).applyWhere = function (this: ModelQueryBuilder) {
  const query = internals(this)
  const whereStack = query.whereStack

  /**
   * Lucid consumes the where stack while applying it, hence the stack is
   * applied from a copy, so the query can be compiled more than once
   */
  query.whereStack = whereStack.map((collection) => [...collection])
  try {
    lucidApplyWhere.call(this)
  } finally {
    query.whereStack = whereStack
  }

  const clauses = scopeClauses(this)
  if (clauses.length === 0) return

  /**
   * Group the where clauses of the query, so an `orWhere` cannot bypass the
   * scope added next to them
   */
  const knexQuery = this.knexQuery as any
  const wheres = knexQuery._statements.filter((statement: any) => statement.grouping === 'where')
  if (wheres.length > 0) {
    knexQuery._statements = knexQuery._statements.filter(
      (statement: any) => statement.grouping !== 'where'
    )
    knexQuery.where((group: any) => group._statements.push(...wheres))
  }

  for (const clause of clauses) {
    knexQuery[clause.method](clause.column)
  }
}

/**
 * Copies the flags of a query builder onto its clone. Defined by the Lucid
 * `Chainable` class and invoked by every `clone()` implementation.
 */
const lucidApplyQueryFlags: (clone: ModelQueryBuilder) => void = (
  ModelQueryBuilder.prototype as any
).applyQueryFlags

/**
 * Carries the soft delete modes over to cloned queries, including the count
 * query of `paginate()`.
 */
;(ModelQueryBuilder.prototype as any).applyQueryFlags = function (
  this: ModelQueryBuilder,
  clone: ModelQueryBuilder
) {
  lucidApplyQueryFlags.call(this, clone)
  clone.trashedMode = this.trashedMode
  clone.includeTrashedParents = this.includeTrashedParents
}
