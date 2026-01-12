import { type ColumnSchema, type TableSchema } from '../types.ts'
import { type Project } from 'ts-morph'
import {
  MigrationTransformer,
  type MigrationTableTransformer,
} from '../code_transformers/migration_transformer.ts'
import { type TableDrift, type ColumnAlteredDrift, type ColumnDrift } from './drift.ts'

export type DatabaseDriftHandlers = {
  [key in TableDrift['type']]: (
    transformer: MigrationTransformer,
    drift: TableDrift & { type: key }
  ) => void
}

export type TableDriftHandlers = {
  [key in ColumnDrift['type']]: (
    up: MigrationTableTransformer,
    down: MigrationTableTransformer,
    drift: ColumnDrift & { type: key }
  ) => void
}

export type ColumnDriftHandlers = {
  [key in keyof ColumnSchema]: (
    up: MigrationTableTransformer,
    down: MigrationTableTransformer,
    drift: ColumnAlteredDrift
  ) => void
}

function addColumn(column: string, schema: ColumnSchema, transformer: MigrationTableTransformer) {
  transformer.addColumn(column, schema.type, (columnWriter) => {
    if (schema.isPrimary === true) {
      columnWriter.callMethod(`primary`)
    }

    if (schema.isNullable) {
      columnWriter.callMethod('nullable')
    } else {
      columnWriter.callMethod('notNullable')
    }

    if (schema.isUnique) {
      columnWriter.callMethod('unique')
    }

    if (schema.default) {
      columnWriter.callMethod('default', [schema.default])
    }
  })
}

const DATABASE_DRIFT_HANDLERS: DatabaseDriftHandlers = {
  'table:created': (transformer, drift) => {
    addTable('up', transformer, drift.table, drift.schema)
    transformer.addDropTable('down', drift.table)
  },
  'table:altered': (transformer, drift) => {
    const up = transformer.addAlterTable('up', drift.table)
    const down = transformer.addAlterTable('down', drift.table)

    for (const columnDrift of drift.drifts) {
      const handler = TABLE_DRIFT_HANDLERS[columnDrift.type]
      handler(up, down, columnDrift as any)
    }
  },
  'table:deleted': (transformer, drift) => {
    transformer.addDropTable('up', drift.table)
    addTable('down', transformer, drift.table, drift.schema)
  },
}

const TABLE_DRIFT_HANDLERS: TableDriftHandlers = {
  'column:created': (up, down, drift) => {
    addColumn(drift.column, drift.schema, up)
    down.addDropColumn(drift.column)
  },
  'column:altered': (up, down, drift) => {
    for (const key of drift.drift) {
      const handler = COLUMN_DRIFT_HANDLERS[key]
      if (!handler) {
        console.log('handler not found', key)
        continue
      }
      handler!(up, down, drift)
    }
  },
  'column:deleted': (up, down, drift) => {
    up.addDropColumn(drift.column)
    addColumn(drift.column, drift.schema, down)
  },
}

const COLUMN_DRIFT_HANDLERS: Partial<ColumnDriftHandlers> = {
  type: (up, down, drift) => {
    const targetArgs = drift.target.maxLength !== undefined ? [drift.target.maxLength] : []
    const sourceArgs = drift.source.maxLength !== undefined ? [drift.source.maxLength] : []
    up.addAlterColumn(drift.column, drift.target.type, targetArgs)
    down.addAlterColumn(drift.column, drift.source.type, sourceArgs)
  },
  isUnique: (up, down, drift) => {
    if (drift.target.isUnique) {
      up.addUnique([drift.column])
      down.addDropUnique([drift.column])
    } else {
      up.addDropUnique([drift.column])
      down.addUnique([drift.column])
    }
  },
  maxLength: (up, down, drift) => {
    if (drift.drift.includes('type')) return

    // Max length behave the same as type
    COLUMN_DRIFT_HANDLERS.type!(up, down, drift)
  },
  isNullable: (up, down, drift) => {
    if (drift.target.isNullable) {
      up.addSetNullable(drift.column)
      down.addDropNullable(drift.column)
    } else {
      up.addDropNullable(drift.column)
      down.addSetNullable(drift.column)
    }
  },
  default: (_up, _down, _drift) => {},
  isPrimary: (up, down, drift) => {
    if (drift.target.isPrimary) {
      up.addPrimary([drift.column])
      down.addDropPrimary([drift.column])
    } else {
      up.addDropPrimary([drift.column])
      down.addPrimary([drift.column])
    }
  },
}

function addTable(
  lifecycle: 'up' | 'down',
  transformer: MigrationTransformer,
  table: string,
  schema: TableSchema
) {
  const create = transformer.addCreateTable(lifecycle, table)

  for (const [column, columnSchema] of Object.entries(schema.columns)) {
    addColumn(column, columnSchema, create)
  }
}

export class MigrationGenerator {
  private transformer: MigrationTransformer

  constructor(
    private drifts: TableDrift[],
    project: Project,
    path: string
  ) {
    this.transformer = new MigrationTransformer(path, project)
  }

  async generate() {
    for (const drift of this.drifts) {
      const handler = DATABASE_DRIFT_HANDLERS[drift.type]
      handler(this.transformer, drift as any)
    }

    return this.transformer
  }
}
