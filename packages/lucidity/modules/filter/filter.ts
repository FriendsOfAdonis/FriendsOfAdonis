import { scope } from '@adonisjs/lucid/orm'
import { LucidModel, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { StrictValues } from '@adonisjs/lucid/types/querybuilder'
import { ExtractModelRelations } from '@adonisjs/lucid/types/relations'
import { FILTER_OPERATORS } from './constants.ts'
import {
  FilterCondition,
  FilterOperator,
  FilterParams,
  FilterScope,
  FilterScopeParams,
  SearchScope,
  SortParams,
} from './types.ts'

export type FilterScopeOptions<Model extends LucidModel> = {
  filterable?: string[] // TODO: Rewrite ExtractModelColumns
  sortable?: string[] // TODO: Rewrite ExtractModelColumns
  relations?: {
    [Relation in ExtractModelRelations<InstanceType<Model>>]?: FilterScope<any>
  }
  search?: SearchScope<Model>
}

/**
 * Build a query scope that applies request filters against an allowlist
 * of columns, relations and sortable fields.
 */
export function filterScope<Model extends LucidModel>(
  options: FilterScopeOptions<Model>
): FilterScope<Model> {
  return scope((query, params: FilterScopeParams) => {
    if (params.filter) {
      applyFilterParams(query, options, params.filter)
    }

    if (typeof params.search === 'string' && params.search !== '') {
      applySearch(query, options, params.search)
    }

    if (params.sort) {
      applySort(query, options, params.sort)
    }
  }) as FilterScope<Model>
}

function applySearch(
  query: ModelQueryBuilderContract<any>,
  options: FilterScopeOptions<any>,
  value: string
) {
  if (!options.search) return

  query.where((q) => {
    options.search!(q, value)
  })
}

/**
 * Walk a `FilterParams` tree and apply every allowed clause to the query.
 * Unknown keys (not filterable, not a declared relation) are ignored.
 */
function applyFilterParams(
  query: ModelQueryBuilderContract<any>,
  options: FilterScopeOptions<any>,
  params: FilterParams
) {
  const { $and, $or, ...fields } = params

  for (const [key, value] of Object.entries(fields)) {
    /**
     * Relation filter: recurse into the related model's filter scope
     * through a `whereHas` constraint. The nested value is the related
     * model's filter tree, so it is re-wrapped into a `{ filter }` envelope.
     */
    const relationFilter = options.relations?.[key]
    if (relationFilter) {
      query.whereHas(key as never, (related) => {
        relationFilter(related as ModelQueryBuilderContract<any>, { filter: value as FilterParams })
      })
      continue
    }

    /**
     * Column filter: only apply when explicitly allowlisted.
     */
    if (options.filterable?.includes(key)) {
      applyCondition(query, key, value as FilterCondition)
    }
  }

  /**
   * `$and`: each group is its own nested constraint, all combined with AND.
   */
  if ($and) {
    for (const group of $and) {
      query.where((sub) => applyFilterParams(sub, options, group))
    }
  }

  /**
   * `$or`: each group is OR-ed together inside a single wrapping constraint.
   */
  if ($or) {
    query.where((sub) => {
      for (const group of $or) {
        sub.orWhere((nested) => applyFilterParams(nested, options, group))
      }
    })
  }

  return query
}

/**
 * Apply a single field condition. An object is read as an operator map,
 * anything else is treated as an `$eq` shorthand.
 */
function applyCondition(
  query: ModelQueryBuilderContract<any>,
  key: string,
  condition: FilterCondition
) {
  if (condition !== null && typeof condition === 'object' && !Array.isArray(condition)) {
    for (const [operator, value] of Object.entries(condition)) {
      if (FILTER_OPERATORS.includes(operator as FilterOperator)) {
        applyOperator(query, operator as FilterOperator, key, value)
      }
    }
    return
  }

  applyOperator(query, '$eq', key, condition)
}

/**
 * Translate a single operator into its Lucid query builder call.
 */
function applyOperator(
  query: ModelQueryBuilderContract<any>,
  operator: FilterOperator,
  key: string,
  value: unknown
) {
  switch (operator) {
    case '$eq':
      query.where(key, value as StrictValues)
      break
    case '$ne':
      query.whereNot(key, value as StrictValues)
      break
    case '$gt':
      query.where(key, '>', value as StrictValues)
      break
    case '$gte':
      query.where(key, '>=', value as StrictValues)
      break
    case '$lt':
      query.where(key, '<', value as StrictValues)
      break
    case '$lte':
      query.where(key, '<=', value as StrictValues)
      break
    case '$in':
      query.whereIn(key, asArray(value) as StrictValues[])
      break
    case '$notIn':
      query.whereNotIn(key, asArray(value) as StrictValues[])
      break
    case '$contains':
      query.whereLike(key, `%${value}%`)
      break
    case '$startsWith':
      query.whereLike(key, `${value}%`)
      break
    case '$endsWith':
      query.whereLike(key, `%${value}`)
      break
    case '$between': {
      const [from, to] = asArray(value)
      query.whereBetween(key, [from as StrictValues, to as StrictValues])
      break
    }
    case '$null':
      if (isTruthy(value)) query.whereNull(key)
      else query.whereNotNull(key)
      break
  }
}

/**
 * Apply sorting from a `{ field: 'asc' | 'desc' }` map, restricted to the
 * sortable allowlist. Order of keys defines order of precedence.
 */
function applySort(
  query: ModelQueryBuilderContract<any>,
  options: FilterScopeOptions<any>,
  sort: SortParams
) {
  for (const [column, direction] of Object.entries(sort)) {
    if (options.sortable?.includes(column)) {
      query.orderBy(column, String(direction).toLowerCase() === 'desc' ? 'desc' : 'asc')
    }
  }
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [value]
}

function isTruthy(value: unknown): boolean {
  return value === true || value === 'true' || value === 1 || value === '1'
}
