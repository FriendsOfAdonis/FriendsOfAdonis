import type { UnWrapLazyImport, LazyImport, Constructor } from '@adonisjs/core/types/common'
import { type BaseAction } from './base_action.ts'
import { type AsControllerContract } from './mixins/as_controller.ts'
import { type AsListenerContract } from './mixins/as_listener.ts'

/**
 * Creates an ActionLoader for lazy-loading actions.
 * Provides type-safe methods based on interfaces the action implements.
 */
export function loader<Import extends LazyImport<Constructor<BaseAction>>>(fn: Import) {
  return {
    $type: 'loader',
    asController: () => [fn, 'asController'] as const,
    asListener: () => [fn, 'asListener'] as const,
    import: fn,
  } as LoaderMethods<Import>
}

/**
 * Available methods on an ActionLoader, conditionally typed based
 * on which interfaces the loaded action implements.
 */
export interface LoaderMethods<Import extends LazyImport<Constructor<BaseAction>>> {
  /**
   * Used for tagging the object to identify loader methods in flattenActions.
   *
   * @internal
   */
  $type: 'loader'

  asController: InstanceType<UnWrapLazyImport<Import>> extends AsControllerContract
    ? () => [Import, 'asController']
    : never

  asListener: InstanceType<UnWrapLazyImport<Import>> extends AsListenerContract
    ? () => [Import, 'asListener']
    : never

  import: Import
}
