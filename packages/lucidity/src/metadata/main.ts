import { type IndexSchema } from '../types.ts'
import { createMetadataStorage } from './factory.ts'

export const IndexMetadataKey = Symbol('lucidity.index')
export const IndexMetadataStorage =
  createMetadataStorage<Record<string, IndexSchema>>(IndexMetadataKey)
