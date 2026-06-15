import {
  type UnWrapLazyImport,
  type LazyImport,
  type Constructor,
} from '@adonisjs/core/types/common'
import { type BaseAction } from './base_action.ts'
import { type AsController, type AsListener } from './types.ts'

/**
 * Creates an ActionLoader for lazy-loading actions.
 * Provides type-safe methods based on interfaces the action implements.
 */
export function loader<Import extends LazyImport<Constructor<BaseAction>>>(fn: Import) {
  return {
    asController: () => [fn, 'asController'] as const,
    asListener: () => [fn, 'asListener'] as const,
  } as LoaderMethods<Import>
}

/**
 * Available methods on an ActionLoader, conditionally typed based
 * on which interfaces the loaded action implements.
 */
export interface LoaderMethods<Import extends LazyImport<Constructor<BaseAction>>> {
  asController: InstanceType<UnWrapLazyImport<Import>> extends AsController
    ? () => [Import, 'asController']
    : never
  asListener: InstanceType<UnWrapLazyImport<Import>> extends AsListener
    ? () => [Import, 'asListener']
    : never
}
