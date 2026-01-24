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

export function loader<Import extends LazyImport<typeof BaseAction>>(fn: Import) {
  return new ActionLoader(fn) as unknown as OmitNever<LoaderMethods<Import>>
}

export interface LoaderMethods<Import extends LazyImport<typeof BaseAction>> {
  asController: InstanceType<UnWrapLazyImport<Import>> extends AsController ? () => RouteFn : never
  asListener: InstanceType<UnWrapLazyImport<Import>> extends AsListener
    ? () => ListenerFn<Parameters<InstanceType<UnWrapLazyImport<Import>>['asListener']>[0]>
    : never
}

type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K]
}

export class ActionLoader extends Macroable implements LoaderMethods<any> {
  static #runner?: ActionsRunner

  static useRunner(runner: ActionsRunner) {
    this.#runner = runner
  }

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
