import { type LucidModel } from '@adonisjs/lucid/types/model'
import { IndexMetadataStorage } from '../metadata/main.ts'
import { type IndexSchema } from '../types.ts'
import { formatIndexName } from '../utils.ts'

function index(options: Omit<IndexSchema, 'isUnique'> & { name?: string; isUnique?: boolean }) {
  return function (target: Function) {
    const metadata = IndexMetadataStorage.getMetadata(target) ?? {}

    const Model = target as LucidModel

    const name =
      options.name ??
      formatIndexName(options.isUnique ? 'unique' : 'index', Model.table, options.columns)

    IndexMetadataStorage.defineMetadata(target, {
      ...metadata,
      [name]: {
        columns: options.columns,
        isUnique: options.isUnique ?? false,
      },
    })
  }
}

export const table = { index }
