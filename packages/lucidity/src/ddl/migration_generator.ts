import { type DatabaseSchema, type ColumnSchemaOptions } from '../types.ts'
import { type DeepPartial } from '@adonisjs/core/types/common'
import { type Project } from 'ts-morph'
import {
  MigrationTransformer,
  type TableWriter,
} from '../code_transformers/migration_transformer.ts'
import { databaseDiff, type DetailedDiff } from './diff.ts'

export class MigrationGenerator {
  private transformer: MigrationTransformer

  constructor(
    private source: DatabaseSchema,
    private target: DatabaseSchema,
    project: Project,
    path: string
  ) {
    this.transformer = new MigrationTransformer(path, project)
  }

  async generate() {
    const diff = databaseDiff(this.source, this.target)

    if (
      !this.#hasChanges(diff.added) &&
      !this.#hasChanges(diff.updated) &&
      !this.#hasChanges(diff.deleted)
    ) {
      return false
    }

    this.generateCreateTables(diff.added)
    this.generateAlterTables(diff.updated)

    return this.transformer
  }

  generateCreateTables(diff: DeepPartial<DatabaseSchema>) {
    for (const [tableName, tableSchema] of Object.entries(diff.tables ?? {})) {
      if (!tableSchema) continue

      const up = this.transformer.addCreateTable('up', tableName)
      this.transformer.addDropTable('down', tableName)

      for (const [columnName, columnSchema] of Object.entries(tableSchema.columns ?? {})) {
        if (!columnSchema) continue
        const targetColumnSchema = this.target.tables[tableName].columns[columnName]

        this.#generateCreateColumn(columnName, targetColumnSchema, up)
      }

      for (const [indexName, indexSchema] of Object.entries(tableSchema.indices ?? {})) {
        if (!indexSchema) continue

        console.log(indexName)
      }
    }
  }

  generateAlterTables(diff: DeepPartial<DatabaseSchema>) {
    for (const [tableName, tableSchema] of Object.entries(diff.tables ?? {})) {
      if (!tableSchema) continue

      const up = this.transformer.addAlterTable('up', tableName)
      const down = this.transformer.addAlterTable('down', tableName)

      for (const [columnName, columnSchema] of Object.entries(tableSchema.columns ?? {})) {
        if (!columnSchema) continue

        const targetColumnSchema = this.target.tables[tableName].columns[columnName]
        const sourceColumnSchema = this.target.tables[tableName].columns[columnName]

        if (!this.source.tables[tableName].columns[columnName]) {
          this.#generateCreateColumn(columnName, targetColumnSchema, up)
          down.addDropColumn(columnName)
          continue
        }

        if (columnSchema.type !== undefined) {
          up.addDropColumn(columnName)
          this.#generateCreateColumn(columnName, targetColumnSchema, up)

          down.addDropColumn(columnName)
          this.#generateCreateColumn(columnName, sourceColumnSchema, down)

          continue
        }

        if (columnSchema.nullable !== undefined) {
          if (columnSchema.nullable) {
            up.addSetNullable(columnName)
            down.addDropNullable(columnName)
          } else {
            up.addDropNullable(columnName)
            down.addSetNullable(columnName)
          }
        }

        if (columnSchema.unique !== undefined) {
          up.addUnique([columnName])
          down.addDropUnique([columnName])
        }
      }
    }
  }

  #generateCreateColumn(columnName: string, schema: ColumnSchemaOptions, writer: TableWriter) {
    writer.addColumn(columnName, schema.type, (columnWriter) => {
      if (schema.isPrimary === true) {
        columnWriter.callMethod(`primary`)
      }

      if (schema.nullable) {
        columnWriter.callMethod('nullable')
      } else {
        columnWriter.callMethod('notNullable')
      }

      if (schema.unique) {
        columnWriter.callMethod('unique')
      }

      if (schema.default) {
        columnWriter.callMethod('default', [schema.default])
      }
    })

    // TODO: Down
  }

  #hasChanges(diff: DeepPartial<DatabaseSchema>) {
    return diff.tables && Object.keys(diff.tables).length > 0
  }

  printDiff(diff: DetailedDiff) {
    const added = diff.added as DeepPartial<DatabaseSchema>
    const altered = diff.updated as DeepPartial<DatabaseSchema>
    const deleted = diff.deleted as DeepPartial<DatabaseSchema>

    const print = (type: 'added' | 'altered' | 'deleted', element: DeepPartial<DatabaseSchema>) => {
      for (const [tableName, tableSchema] of Object.entries(element.tables ?? {})) {
        if (!tableSchema) continue

        console.log(`${type} table ${tableName}:`)

        for (const [columnName, columnSchema] of Object.entries(tableSchema.columns ?? {})) {
          console.log(`- ${columnName}:`)

          if (type === 'altered') {
            for (const key of Object.keys(columnSchema ?? {})) {
              // @ts-ignore
              const sourceValue = this.source.tables[tableName].columns[columnName][key as any]
              // @ts-ignore
              const targetValue = this.target.tables[tableName].columns[columnName][key as any]

              console.log(`  - ${key}: ${sourceValue} -> ${targetValue}`)
            }
          }
        }
      }
      console.log('')
    }

    print('added', added)
    print('altered', altered)
    print('deleted', deleted)
  }
}
