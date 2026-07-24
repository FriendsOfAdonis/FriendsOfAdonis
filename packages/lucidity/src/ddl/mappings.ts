import { type KnexColumnType } from '../types.ts'

type Mapping = {
  [key in KnexColumnType | (string & {})]: KnexColumnType
}

/**
 * List of data types mapping to transform sql types to
 * knex schema builder column type.
 */
export const DATA_TYPES_MAPPING: Mapping = {
  // Known Knex types
  integer: 'integer',
  tinyint: 'tinyint',
  smallint: 'smallint',
  mediumint: 'mediumint',
  bigint: 'bigint',
  text: 'text',
  string: 'string',
  float: 'float',
  double: 'double',
  decimal: 'decimal',
  boolean: 'boolean',
  date: 'date',
  datetime: 'datetime',
  time: 'time',
  timestamp: 'timestamp',
  geometry: 'geometry',
  geography: 'geometry',
  point: 'point',
  binary: 'binary',
  enum: 'enum',
  json: 'json',
  jsonb: 'jsonb',
  uuid: 'uuid',

  // PostgreSQL https://github.com/knex/knex/blob/master/lib/dialects/postgres/schema/pg-columncompiler.js#L142
  varchar: 'string',
  bytea: 'binary',
  bool: 'boolean',
}

export const KNEX_COLUMN_TYPES = [
  'integer',
  'tinyint',
  'smallint',
  'mediumint',
  'bigint',
  'text',
  'string',
  'float',
  'double',
  'decimal',
  'boolean',
  'date',
  'datetime',
  'time',
  'timestamp',
  'geometry',
  'geography',
  'point',
  'enum',
  'binary',
  'json',
  'jsonb',
  'uuid',
] as const

/**
 * List of known Knex types accepting maxLenght as second param
 */
export const MAX_LENGTH_TYPES: string[] = ['string', 'text', 'integer', 'binary', 'tinyint']
