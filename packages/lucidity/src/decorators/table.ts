import { IndexMetadataStorage } from '../metadata/main.ts'
import { type IndexSchema } from '../types.ts'

function index(options: Omit<IndexSchema, 'isUnique'> & { name?: string; isUnique?: boolean }) {
  return function (target: Function) {
    const metadata = IndexMetadataStorage.getMetadata(target) ?? {}

    const name = options.name ?? `idx_${options.columns.join('_')}`

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
