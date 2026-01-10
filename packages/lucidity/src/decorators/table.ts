import { IndexMetadataStorage } from '../metadata/main.ts'
import { type IndexSchema } from '../types.ts'

function index(options: Omit<IndexSchema, 'unique'> & { name?: string; unique?: boolean }) {
  return function (target: Function) {
    const metadata = IndexMetadataStorage.getMetadata(target) ?? {}

    const name = options.name ?? `idx_${options.columns.join('_')}`

    IndexMetadataStorage.defineMetadata(target, {
      ...metadata,
      [name]: {
        columns: options.columns,
        unique: options.unique ?? false,
      },
    })
  }
}

export const table = { index }
