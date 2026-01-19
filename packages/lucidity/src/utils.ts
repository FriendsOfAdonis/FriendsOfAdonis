import { type UIPrimitives } from '@adonisjs/core/types/ace'
import { type ColumnAlteredDrift, type TableDrift } from './ddl/drift.ts'
import chalk from 'chalk'
import { type ColumnSchema } from './types.ts'

/**
 * Utility function for formatting index name.
 *
 * @see https://github.com/knex/knex/blob/master/lib/schema/tablecompiler.js#L392
 */
export function formatIndexName(type: string, tableName: string, columns: string[]) {
  const table = tableName.replace(/\.|-/g, '_')
  const indexName = (table + '_' + columns.join('_') + '_' + type).toLowerCase()
  return indexName
}

const COLORS = {
  bgAdded: chalk.bgHex('#009966'),
  added: chalk.hex('#009966'),
  bgAltered: chalk.bgHex('#e17100'),
  altered: chalk.hex('#e17100'),
  bgDeleted: chalk.bgHex('#fb2c36'),
  deleted: chalk.hex('#fb2c36'),
}

function coloredOption(option: string, value: any) {
  if (value === false || value === undefined) return COLORS.deleted(`-${option}`)
  if (value === true) return COLORS.added(`+${option}`)
  return COLORS.altered(`~${option}:"${value.toString()}"`)
}

export function prettyPrintDrift(ui: UIPrimitives, drifts: TableDrift[]) {
  ui.logger.log('')
  for (const drift of drifts) {
    const table = ui.table({})

    function addCreatedColumnRow(column: string, schema: ColumnSchema) {
      const options = []
      if (schema.isPrimary) options.push('primary')
      if (schema.isUnique) options.push('unique')
      if (schema.isNullable) options.push('nullable')
      if (schema.autoIncrement) options.push('autoincrement')
      if (schema.maxLength !== undefined) options.push(`maxlength:${schema.maxLength}`)
      if (schema.default !== undefined) options.push(`default:"${schema.maxLength}"`)

      table.row([COLORS.added(`+ ${column}`), schema.type, options.join(' | ')])
    }

    function addAlteredColumnRow(column: string, columnDrift: ColumnAlteredDrift) {
      const options = []
      let type = columnDrift.target.type

      if (columnDrift.drift.includes('isPrimary')) {
        options.push(coloredOption('primary', columnDrift.target.isPrimary))
      }

      if (columnDrift.drift.includes('isUnique')) {
        options.push(coloredOption('unique', columnDrift.target.isUnique))
      }

      if (columnDrift.drift.includes('isNullable')) {
        options.push(coloredOption('nullable', columnDrift.target.isNullable))
      }

      if (columnDrift.drift.includes('autoIncrement')) {
        options.push(coloredOption('autoincrement', columnDrift.target.autoIncrement))
      }

      if (columnDrift.drift.includes('maxLength')) {
        options.push(coloredOption('maxlength', columnDrift.target.maxLength))
      }

      if (columnDrift.drift.includes('default')) {
        options.push(coloredOption('default', columnDrift.target.default))
      }

      if (columnDrift.drift.includes('values')) {
        options.push(coloredOption('enum', columnDrift.target.values))
      }

      if (columnDrift.drift.includes('type')) {
        type = COLORS.altered(`~ ${columnDrift.source.type}->${columnDrift.target.type}`)
      }

      table.row([COLORS.altered(`~ ${column}`), type, options.join(' | ')])
    }

    function addDeletedColumnRow(column: string) {
      table.row([COLORS.deleted(`- ${column}`)])
    }

    if (drift.type === 'table:created') {
      ui.logger.log(COLORS.bgAdded(` + table ${drift.table} created `))
      table.head(['Column', 'Type', 'Options'])

      for (const [column, schema] of Object.entries(drift.schema.columns)) {
        addCreatedColumnRow(column, schema)
      }
    }

    if (drift.type === 'table:altered') {
      ui.logger.log(COLORS.bgAltered(` ~ table ${drift.table} altered `))
      table.head(['Column', 'Type', 'Options'])

      for (const columnDrift of drift.drifts) {
        if (columnDrift.type === 'column:created') {
          addCreatedColumnRow(columnDrift.column, columnDrift.schema)
        }

        if (columnDrift.type === 'column:altered') {
          addAlteredColumnRow(columnDrift.column, columnDrift)
        }

        if (columnDrift.type === 'column:deleted') {
          addDeletedColumnRow(columnDrift.column)
        }

        if (columnDrift.column === 'full_name') {
          console.log(columnDrift)
        }
      }
    }

    if (drift.type === 'table:deleted') {
      ui.logger.log(COLORS.bgDeleted(` - table ${drift.table} deleted `))
    }

    table.render()
    ui.logger.log('')
  }
}
