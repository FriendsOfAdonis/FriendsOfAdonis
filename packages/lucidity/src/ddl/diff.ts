import { detailedDiff } from 'deep-object-diff'
import { type DatabaseSchema } from '../types.ts'
import { type DeepPartial } from '@adonisjs/core/types/common'

export type DetailedDiff = {
  added: DeepPartial<DatabaseSchema>
  updated: DeepPartial<DatabaseSchema>
  deleted: DeepPartial<DatabaseSchema>
}

const IGNORED_TABLES = ['adonis_schema', 'adonis_schema_versions', 'auth_access_tokens']

export function databaseDiff(source: DatabaseSchema, target: DatabaseSchema): DetailedDiff {
  const { added, updated, deleted } = detailedDiff(source, target) as DetailedDiff

  console.log(added.tables!.recipes)

  for (const [tableName] of Object.entries(added.tables ?? {})) {
    if (IGNORED_TABLES.includes(tableName) || source.tables[tableName]) {
      delete added?.tables?.[tableName]
    }
  }

  for (const [tableName] of Object.entries(updated.tables ?? {})) {
    if (IGNORED_TABLES.includes(tableName)) {
      delete updated?.tables?.[tableName]
    }
  }

  for (const [tableName] of Object.entries(deleted.tables ?? {})) {
    if (IGNORED_TABLES.includes(tableName) || target.tables[tableName]) {
      delete deleted?.tables?.[tableName]
    }
  }

  return { added, updated, deleted }
}
