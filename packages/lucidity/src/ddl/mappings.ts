/**
 * List of data types mapping to transform sql types to
 * knex schema builder column type.
 */
export const DATA_TYPES_MAPPING: NodeJS.Dict<string> = {
  varchar: 'string',
  number: 'integer',
}
