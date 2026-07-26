import { type NormalizeConstructor } from '@adonisjs/core/types/common'
import { type BaseAction } from '../base_action.ts'
import { type BaseCommand } from '@adonisjs/core/ace'
import { type CommandMetaData } from '@adonisjs/core/types/ace'
import { E_NOT_IMPLEMENTED_EXCEPTION } from '../errors.ts'

export type AsCommandOptions = Partial<CommandMetaData>

/**
 * Contract used by the AsCommand mixin.
 */
export interface AsCommandContract {
  asCommand(command: BaseCommand): any
}

/**
 * Mixin to make an action runnable as a command.
 *
 * Any action using this mixin must implement the `asCommand()` method.
 *
 * @example
 * ```ts
 * import { compose } from '@adonisjs/core/helpers'
 * import { BaseAction, AsCommand } from '@foadonis/actions'
 *
 * export default class SendEmailAction extends compose(BaseAction, AsCommand()) {
 *
 *   async handle(user: User, subject: string, body: string) {
 *     await mailer.send(user.email, subject, body)
 *   }
 *
 *   async asCommand(command: BaseCommand) {
 *     const email = await command.prompt.ask('Enter user email')
 *     const user = await User.findByOrFail({ email })
 *     const subject = await command.prompt.ask('Subject')
 *     const body = await command.prompt.ask('Body')
 *
 *     await this.handle(user, subject, body)
 *   }
 *
 * }
 *
 * ```
 */
export function AsCommand(options: AsCommandOptions = {}) {
  return function <Action extends NormalizeConstructor<typeof BaseAction>>(superclass: Action) {
    class AsCommandImpl extends superclass implements AsCommandContract {
      /**
       * Store command options for the ActionCommandsLoader.
       *
       * @internal
       */
      public static $commandOptions: AsCommandOptions = options

      constructor(...args: any[]) {
        super(...args)
        this.$wrapMethod('asCommand', this.asCommand)
      }

      /**
       * Entrypoint executed when the action is executed as a command.
       *
       * @example
       * ```typescript
       * async asCommand(command: BaseCommand) {
       *   await this.handle({ ... })
       * }
       * ```
       */
      // @ts-expect-error -- Required for clean user-facing api
      asCommand(command: BaseCommand): Promise<any> {
        throw new E_NOT_IMPLEMENTED_EXCEPTION([this.constructor.name, 'AsCommand', 'asCommand'])
      }
    }

    return AsCommandImpl
  }
}
