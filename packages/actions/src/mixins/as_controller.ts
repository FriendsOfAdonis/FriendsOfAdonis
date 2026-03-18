import { type NormalizeConstructor } from '@adonisjs/core/types/common'
import { type BaseAction } from '../base_action.ts'
import { type HttpContext } from '@adonisjs/core/http'
import { E_NOT_IMPLEMENTED_EXCEPTION } from '../errors.ts'

/**
 * Contract used by the AsController mixin.
 */
export interface AsControllerContract {
  asController(context: HttpContext): any
}

/**
 * Mixin to make an action runnable as a route handler.
 *
 * Any action using this mixin must implement the `asController()` method.
 *
 * @example
 * ```ts
 * import { compose } from '@adonisjs/core/helpers'
 * import { BaseAction, AsController } from '@foadonis/actions'
 *
 * export default class SendEmailAction extends compose(BaseAction, AsController()) {
 *
 *   async handle(user: User, subject: string, body: string) {
 *     await mailer.send(user.email, subject, body)
 *   }
 *
 *   async asController({ request }: HttpContext) {
 *     const { userId, subject, body } = await request.validateUsing(sendEmailValidator)
 *     const user = await User.findOrFail(userId)
 *
 *     await this.handle(user, subject, body)
 *
 *     return response.ok("Success")
 *   }
 *
 * }
 *
 * ```
 */
export function AsController() {
  return function <Action extends NormalizeConstructor<typeof BaseAction>>(superclass: Action) {
    class AsControllerImpl extends superclass implements AsControllerContract {
      constructor(...args: any[]) {
        super(...args)
        this.$wrapMethod('asController', this.asController)
      }

      /**
       * Entrypoint executed when the action is executed as a route handler.
       *
       * @example
       * ```typescript
       * async asController(context: HttpContext) {
       *   await this.handle({ ... })
       * }
       * ```
       */
      // @ts-expect-error -- Required for clean user-facing api
      asController(context: HttpContext): any {
        throw new E_NOT_IMPLEMENTED_EXCEPTION([
          this.constructor.name,
          'AsController',
          'asController',
        ])
      }
    }

    return AsControllerImpl
  }
}
