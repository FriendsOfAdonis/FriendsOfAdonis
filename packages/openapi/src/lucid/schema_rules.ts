import { type SchemaRules } from '@adonisjs/lucid/types/schema_generator'
import { generateSchemaColumn, generateSchemaType } from './main.ts'

export default {
  types: {
    number: generateSchemaType(),
    bigint: generateSchemaType(),
    decimal: generateSchemaType(),
    boolean: generateSchemaType(),
    string: generateSchemaType(),
    date: generateSchemaType(),
    time: generateSchemaType(),
    binary: generateSchemaType(),
    json: generateSchemaType(),
    jsonb: generateSchemaType(),
    DateTime: generateSchemaType(),
    uuid: generateSchemaType(),
    enum: generateSchemaType(),
    set: generateSchemaType(),
    unknown: generateSchemaType(),
  },
  columns: {
    id: generateSchemaColumn('id'),
    updated_at: generateSchemaColumn('updated_at'),
    created_at: generateSchemaColumn('created_at'),
  },
  tables: {},
} satisfies SchemaRules
