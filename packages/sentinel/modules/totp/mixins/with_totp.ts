import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { BaseModel } from '@adonisjs/lucid/orm'
import { primaryKeyOf, staticImplements } from '../../../src/helpers.ts'
import { TOTPAuthenticator } from '../models/totp_authenticator.ts'
import {
  AuthenticatorOptions,
  CreateAuthenticatorOptions,
  TOTPAuthenticableContract,
} from '../types.ts'
import { TOTPManager } from '../manager.ts'

/**
 * Options accepted by the "withTOTP" mixin. They override the config
 * of the manager for the model.
 */
export interface WithTOTPOptions extends Partial<AuthenticatorOptions> {}

type WithTOTPRow = TOTPAuthenticableContract & {
  /**
   * Enrolls a new authenticator. See "TOTPAuthenticator.createFor"
   * for the details.
   */
  createAuthenticator(options?: CreateAuthenticatorOptions): Promise<TOTPAuthenticator>

  /**
   * Returns the authenticator in use, or null until an enrollment
   * is confirmed by a first valid code. The "unverified" flag
   * returns the enrollment in flight instead.
   *
   * The newest one is returned. Since confirming an enrollment
   * retires the older ones, at most one unconfirmed enrollment
   * sits next to the one in use. The query runs in the
   * transaction of the model, so an enrollment created inside
   * it is found.
   */
  retrieveAuthenticator(unverified?: boolean): Promise<TOTPAuthenticator | null>
}

type WithTOTPClass<
  Model extends NormalizeConstructor<typeof BaseModel> = NormalizeConstructor<typeof BaseModel>,
> = Model & {
  new (...args: any[]): WithTOTPRow
}

/**
 * Mixin to add TOTP authenticators to a model.
 *
 * Under the hood, this mixin defines following methods
 *
 * - getTOTPOptions, getTOTPLabel and getTOTPManager methods to
 *   configure the authenticators of the model
 * - createAuthenticator method to enroll a new authenticator
 * - retrieveAuthenticator method to find the authenticator in use
 *
 * @param manager - The TOTP manager
 * @param defaults - Options overriding the config of the manager
 *
 * @example
 * import totp from '@foadonis/sentinel/services/totp'
 *
 * class User extends compose(BaseModel, totp.withTOTP({ issuer: 'My app' })) {}
 */
export function withTOTP(manager: TOTPManager, defaults: WithTOTPOptions = {}) {
  return function <Model extends NormalizeConstructor<typeof BaseModel>>(
    superclass: Model
  ): WithTOTPClass<Model> {
    @staticImplements<WithTOTPClass>()
    class WithTOTPImpl extends superclass implements WithTOTPRow {
      getTOTPOptions() {
        return {
          ...manager.config,
          ...defaults,
        }
      }

      getTOTPLabel() {
        return this.$getAttribute('email')
      }

      getTOTPManager() {
        return manager
      }

      async createAuthenticator(
        options: CreateAuthenticatorOptions = {}
      ): Promise<TOTPAuthenticator> {
        return TOTPAuthenticator.createFor(this, options)
      }

      async retrieveAuthenticator(unverified = false): Promise<TOTPAuthenticator | null> {
        const authenticator = await TOTPAuthenticator.query({ client: this.$trx })
          .where('tokenable_id', primaryKeyOf(this, 'retrieve authenticator for') as any)
          .if(!unverified, (q) => q.whereNotNull('verified_at'))
          .orderBy('id', 'desc')
          .first()

        if (!authenticator) return null

        return authenticator.link(this)
      }
    }

    return WithTOTPImpl
  }
}
