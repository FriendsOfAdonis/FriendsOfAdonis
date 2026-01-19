import { type TableSchema, type DatabaseSchema, type ColumnSchema } from '../types.ts'

export type TableCreatedDrift = {
  type: 'table:created'
  table: string
  schema: TableSchema
}

export type TableAlteredDrift = {
  type: 'table:altered'
  table: string
  drifts: ColumnDrift[]
}

export type TableDeletedDrift = {
  type: 'table:deleted'
  table: string
  schema: TableSchema
}

export type TableDrift = TableCreatedDrift | TableAlteredDrift | TableDeletedDrift

export const IGNORED_TABLES = ['adonis_schema_versions', 'adonis_schema', 'auth_access_tokens']

/**
 * Analyse database drift between two database schemas.
 *
 * @returns list of drifts or false if no there are no drifts
 */
export function analyseDatabaseDrift(source: DatabaseSchema, target: DatabaseSchema) {
  const drifts: TableDrift[] = []

  for (const [tableName, tableSchema] of Object.entries(source.tables)) {
    if (IGNORED_TABLES.includes(tableName)) continue

    if (!target.tables[tableName]) {
      drifts.push({
        type: 'table:deleted',
        table: tableName,
        schema: tableSchema,
      })
    }
  }

  for (const [tableName, tableSchema] of Object.entries(target.tables)) {
    if (IGNORED_TABLES.includes(tableName)) continue

    if (!source.tables[tableName]) {
      drifts.push({
        type: 'table:created',
        table: tableName,
        schema: tableSchema,
      })
      continue
    }

    const columnDrifts = analyseTableDrift(source.tables[tableName], tableSchema)

    if (columnDrifts) {
      drifts.push({
        type: 'table:altered',
        table: tableName,
        drifts: columnDrifts,
      })
    }
  }

  if (drifts.length === 0) {
    return false
  }

  return drifts
}

export type ColumnDrift = ColumnCreatedDrift | ColumnAlteredDrift | ColumnDeletedDrift

export type ColumnCreatedDrift = {
  type: 'column:created'
  column: string
  schema: ColumnSchema
}

export type ColumnAlteredDrift = {
  type: 'column:altered'
  column: string
  source: ColumnSchema
  target: ColumnSchema
  drift: ObjectDrift<ColumnSchema>
}

export type ColumnDeletedDrift = {
  type: 'column:deleted'
  column: string
  schema: ColumnSchema
}

/**
 * Analyse table drift between two table schemas.
 *
 * @returns list of drifts or false if no there are no drifts
 */
export function analyseTableDrift(source: TableSchema, target: TableSchema) {
  const drifts: ColumnDrift[] = []

  for (const [columnName, columnSchema] of Object.entries(source.columns)) {
    if (!target.columns[columnName]) {
      drifts.push({
        type: 'column:deleted',
        column: columnName,
        schema: columnSchema,
      })
    }
  }

  for (const [columnName, columnSchema] of Object.entries(target.columns)) {
    if (!columnSchema) continue

    if (!source.columns[columnName]) {
      drifts.push({
        type: 'column:created',
        column: columnName,
        schema: columnSchema,
      })
      continue
    }

    const drift = analyzeObjectDrift(source.columns[columnName], target.columns[columnName])

    if (drift) {
      drifts.push({
        type: 'column:altered',
        column: columnName,
        source: source.columns[columnName],
        target: target.columns[columnName],
        drift,
      })
    }
  }

  if (drifts.length === 0) {
    return false
  }

  return drifts
}

export type ObjectDrift<T extends Object> = (keyof T)[]

/**
 * Analyse drift between two objects.
 * Only identify changes with one level depth.
 *
 * @returns altered properties or false if none
 */
export function analyzeObjectDrift<T extends Object>(source: T, target: T) {
  const drift: ObjectDrift<T> = []

  function checkDrift(a: T, b: T) {
    for (const key of Object.keys(a)) {
      const s = a[key as keyof T]
      const t = b[key as keyof T]

      if (Array.isArray(s) && Array.isArray(t)) {
        if (checkArrayEquality(s, t)) {
          continue
        }
      }

      if (s !== t) {
        drift.push(key as keyof T)
      }
    }
  }

  checkDrift(source, target)
  checkDrift(target, source)

  if (drift.length === 0) {
    return false
  }

  return [...new Set(drift)]
}

function checkArrayEquality<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false
  const sortedA = [...a].sort()
  const sortedB = [...b].sort()
  return sortedA.every((val, index) => val === sortedB[index])
}
