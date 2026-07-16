import { type NormalizeConstructor } from '@adonisjs/core/types/common'
import { type BaseAction } from '../base_action.ts'
import { E_NOT_IMPLEMENTED_EXCEPTION } from '../errors.ts'

/**
 * Contract used by the AsListener mixin.
 */
export interface AsListenerContract<T = unknown> {
  asListener(event: T): any
}

/**
 * Mixin to make an action runnable as a listener.
 *
 * Any action using this mixin must implement the `asListener()` method.
 *
 * @example
 * ```ts
 * import { compose } from '@adonisjs/core/helpers'
 * import { BaseAction, AsListener } from '@foadonis/actions'
 *
 * export default class SendEmailAction extends compose(BaseAction, AsListener()) {
 *
 *   async handle(user: User, subject: string, body: string) {
 *     await mailer.send(user.email, subject, body)
 *   }
 *
 *   async asListener(event: UserCreated) {
 *     await this.handle(user, 'Welcome', 'This is a welcome email')
 *   }
 *
 * }
 *
 * ```
 */
export function AsListener<T = unknown>() {
  return function <Action extends NormalizeConstructor<typeof BaseAction>>(superclass: Action) {
    abstract class AsListenerImpl extends superclass implements AsListenerContract<T> {
      constructor(...args: any[]) {
        super(...args)
        this.$wrapMethod('asListener', this.asListener)
      }
      /**
       * Entrypoint executed when the action is executed as a listener.
       *
       * @example
       * ```typescript
       * async asListener(event: UserCreated) {
       *   await this.handle({ ... })
       * }
       * ```
       */
      // @ts-expect-error -- Required for clean user-facing api
      asListener(event: T): any {
        throw new E_NOT_IMPLEMENTED_EXCEPTION([this.constructor.name, 'AsListener', 'asListener'])
      }
    }

    return AsListenerImpl
  }
}
