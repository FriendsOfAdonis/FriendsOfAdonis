import { type HttpContext } from '@adonisjs/core/http'
import { type AsController, type AsListener, type BaseAction } from './base_action.js'
import app from '@adonisjs/core/services/app'
import { type LazyImport, type Constructor } from './types.js'

export class ActionsManager {
  /**
   * Use an Action as a controller.
   *
   * @example
   * router.post('/reset-password', actions.asController(ResetUserPassword))
   */
  asController(c: LazyImport<new () => AsController>) {
    return async (ctx: HttpContext) => {
      const { default: Action } = await c()
      const action = await app.container.make(Action)
      return action.asController(ctx)
    }
  }

  /**
   * Use an Action as an event listener.
   *
   * @example
   * emitter.on('user:registered', actions.asListener(SendWelcomeNotification))
   */
  asListener<T>(c: LazyImport<new () => AsListener<T>>) {
    return async (event: T) => {
      const { default: Action } = await c()
      const action = await app.container.make(Action)
      return action.asListener(event)
    }
  }

  async run<T extends BaseAction>(
    Action: Constructor<T>,
    ...params: Parameters<T['handle']>
  ): Promise<ReturnType<T['handle']>> {
    const action = await app.container.make(Action)

    return action.handle(...params)
  }
}
