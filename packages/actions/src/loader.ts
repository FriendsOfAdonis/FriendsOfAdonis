import { type UnWrapLazyImport, type LazyImport } from '@adonisjs/core/types/common'
import { type BaseAction } from './base_action.ts'
import { type HttpContext } from '@adonisjs/core/http'
import { type ActionsRunner } from './runner.ts'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { implementsAsController, implementsAsListener, parseLazyImportSpecifier } from './utils.ts'
import { type ListenerFn } from '@adonisjs/core/types/events'
import { type RouteFn } from '@adonisjs/core/types/http'
import Macroable from '@poppinss/macroable'
import { type AsController, type AsListener } from './types.ts'

/**
 * Creates an ActionLoader for lazy-loading actions.
 * Provides type-safe methods based on interfaces the action implements.
 */
export function loader<Import extends LazyImport<typeof BaseAction>>(fn: Import) {
  return new ActionLoader(fn) as unknown as OmitNever<LoaderMethods<Import>>
}

/**
 * Available methods on an ActionLoader, conditionally typed based
 * on which interfaces the loaded action implements.
 */
export interface LoaderMethods<Import extends LazyImport<typeof BaseAction>> {
  asController: InstanceType<UnWrapLazyImport<Import>> extends AsController ? () => RouteFn : never
  asListener: InstanceType<UnWrapLazyImport<Import>> extends AsListener
    ? () => ListenerFn<Parameters<InstanceType<UnWrapLazyImport<Import>>['asListener']>[0]>
    : never
}

type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K]
}

/**
 * Handles lazy-loading of actions and adapts them for use
 * in different contexts (routes, events). Macroable for extensibility.
 */
export class ActionLoader extends Macroable implements LoaderMethods<any> {
  static #runner?: ActionsRunner

  /**
   * Configures the runner instance for all ActionLoader instances.
   * Called automatically by the ActionsProvider during boot.
   */
  static useRunner(runner: ActionsRunner) {
    this.#runner = runner
  }

  /**
   * Gets the configured runner instance.
   * @throws {RuntimeException} If no runner has been configured
   */
  static get runner() {
    if (!this.#runner) {
      throw new RuntimeException(
        `Cannot run "${this.name}" action. Make sure to pass runner to the "ActionLoader" class for run to work`
      )
    }

    return this.#runner
  }

  constructor(private factory: LazyImport<typeof BaseAction>) {
    super()
  }

  /**
   * Creates a route handler that executes the action's `asController` method.
   * @throws {RuntimeException} If the action does not implement AsController
   */
  asController() {
    const name = parseLazyImportSpecifier(this.factory.toString())
    const handler = async (context: HttpContext) => {
      const { default: Action } = await this.factory()

      return ActionLoader.runner.dispatch(Action, async (action) => {
        if (implementsAsController(action)) {
          return action.asController(context)
        }

        throw new RuntimeException(`The action "${Action.name}" does not implement "AsController"`)
      })
    }

    Object.defineProperty(handler, 'name', { value: name, configurable: true })

    return handler
  }

  /**
   * Creates an event listener that executes the action's `asListener` method.
   * @throws {RuntimeException} If the action does not implement AsListener
   */
  asListener() {
    const name = parseLazyImportSpecifier(this.factory.toString())
    const handler = async (event: unknown) => {
      const { default: Action } = await this.factory()

      return ActionLoader.runner.dispatch(Action, async (action) => {
        if (implementsAsListener(action)) {
          return action.asListener(event)
        }

        throw new RuntimeException(`The action "${Action.name}" does not implement "AsListener"`)
      })
    }

    Object.defineProperty(handler, 'name', { value: name, configurable: true })

    return handler
  }
}
