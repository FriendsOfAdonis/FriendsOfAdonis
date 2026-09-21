import { LucidModel, ModelQueryBuilderContract, QueryScope } from '@adonisjs/lucid/types/model'
import { FILTER_OPERATORS } from './constants.ts'

export type FilterOperator = (typeof FILTER_OPERATORS)[number]

export type FilterCondition = {
  [Operator in FilterOperator]?: unknown
}

/**
 * A field value: either an operator map or a bare value (implicit `$eq`).
 * Primitives are kept explicit so editors still suggest operators.
 */
export type FilterValue = FilterCondition | string | number | boolean | null

/**
 * The filtering tree: field conditions plus `$and` / `$or` groups.
 * `$`-prefixed keys are reserved so they never collide with column names.
 */
export interface FilterParams {
  $and?: FilterParams[]
  $or?: FilterParams[]
  [field: string]: FilterValue | FilterParams | FilterParams[] | undefined
}

export type SortDirection = 'asc' | 'desc'

export type SortParams = {
  [field: string]: SortDirection
}

/**
 * Top-level shape accepted by a filter scope, keeping filtering and
 * sorting in their own namespaces (`{ filter: {...}, sort: {...} }`).
 */
export type FilterScopeParams = {
  filter?: FilterParams
  sort?: SortParams
  search?: string
}

export type FilterScope<Model extends LucidModel> = QueryScope<
  Model,
  (query: ModelQueryBuilderContract<Model>, params: FilterScopeParams) => void
>

export type SearchScope<Model extends LucidModel> = QueryScope<
  Model,
  (query: ModelQueryBuilderContract<Model>, value: string) => void
>
