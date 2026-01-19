import { type LucidModel } from '@adonisjs/lucid/types/model'
import {
  type TableSchema,
  type DatabaseSchema,
  type IntrospectorContract,
  type ColumnSchema,
  type KnexColumnType,
  type BaseSchemaOptions,
  type ForeignKeySchema,
} from '../types.ts'
import { IndexMetadataStorage } from '../metadata/main.ts'

export class ModelsIntrospector implements IntrospectorContract {
  constructor(private models: LucidModel[]) {}

  async introspect(): Promise<DatabaseSchema> {
    const tables: Record<string, TableSchema> = {}

    for (const model of this.models) {
      const columns: Record<string, ColumnSchema> = {}
      const indices = IndexMetadataStorage.getMetadata(model)
      const foreignKeys = this.introspectForeignKeys(model)

      for (const column of model.$columnsDefinitions.values()) {
        const schema = column.meta?.schema as BaseSchemaOptions | undefined

        if (!schema) continue

        columns[column.columnName] = {
          type: this.toSQLType(schema.type),
          isPrimary: schema.isPrimary,
          isNullable: schema.isNullable,
          isUnique: schema.isUnique,
          default: schema.default,
          maxLength: schema.maxLength,
          values: schema.values,
          autoIncrement: schema.autoIncrement,
        }
      }

      tables[model.table] = {
        columns,
        indices: indices ?? {},
        foreignKeys,
      }
    }

    return {
      tables,
    }
  }

  protected introspectForeignKeys(model: LucidModel) {
    const foreignKeys: Record<string, ForeignKeySchema> = {}

    for (const [, relation] of model.$relationsDefinitions.entries()) {
      if (relation.type !== 'belongsTo') continue
      relation.boot()

      const name = `${model.table}_${relation.foreignKeyColumnName}_foreign`

      foreignKeys[name] = {
        columns: [relation.foreignKeyColumnName],
      }
    }

    return foreignKeys
  }

  toSQLType(type: KnexColumnType | (string & {})) {
    if (type === 'string') return 'varchar'
    if (type === 'enum') return 'text'
    return type
  }
}
