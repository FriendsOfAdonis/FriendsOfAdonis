import { type LucidModel } from '@adonisjs/lucid/types/model'
import {
  type TableSchema,
  type DatabaseSchema,
  type IntrospectorContract,
  type ColumnSchema,
} from '../types.ts'
import { IndexMetadataStorage } from '../metadata/main.ts'

export class ModelsIntrospector implements IntrospectorContract {
  constructor(private models: LucidModel[]) {}

  async introspect(): Promise<DatabaseSchema> {
    const tables: Record<string, TableSchema> = {}

    for (const model of this.models) {
      const columns: Record<string, ColumnSchema> = {}
      const indices = IndexMetadataStorage.getMetadata(model)

      for (const column of model.$columnsDefinitions.values()) {
        const schema = column.meta?.schema as ColumnSchema
        columns[column.columnName] = schema
      }

      tables[model.table] = {
        columns,
        indices: indices ?? {},
      }
    }

    return {
      tables,
    }
  }
}
