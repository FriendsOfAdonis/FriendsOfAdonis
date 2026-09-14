import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { BaseModel } from '@adonisjs/lucid/orm'
import {
  type ManagerReference,
  primaryKeyOf,
  resolveManager,
  staticImplements,
} from '../../../src/helpers.ts'
import totp from '../../../services/totp.ts'
import { TOTPAuthenticator } from '../models/totp_authenticator.ts'
import {
  AuthenticatorOptions,
  CreateAuthenticatorOptions,
  TOTPAuthenticableContract,
} from '../types.ts'
import type { TOTPManager } from '../manager.ts'

/**
 * Options accepted by the "withTOTP" mixin. The authenticator options
 * override the config of the manager for the model.
 */
export interface WithTOTPOptions extends Partial<AuthenticatorOptions> {
  /**
   * The manager encrypting the secrets, or a function returning it.
   *
   * Defaults to the TOTP service of the application, read on every
   * call. Give one when you construct the manager yourself, in
   * tests for example.
   */
  manager?: ManagerReference<TOTPManager>
}

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

  /**
   * The manager of the model. See the static getter
   */
  readonly $totpManager: TOTPManager
}

type WithTOTPClass<
  Model extends NormalizeConstructor<typeof BaseModel> = NormalizeConstructor<typeof BaseModel>,
> = Model & {
  /**
   * The manager encrypting the secrets. It is resolved on every
   * access, from the "manager" option of the mixin or the TOTP
   * service of the application. Override it on the model to give
   * it a manager of its own.
   */
  get $totpManager(): TOTPManager

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
 * - $totpManager static getter to resolve the manager of the model
 *
 * The manager is resolved on every call, not when the mixin is
 * composed, so the model can be defined before the application
 * has booted.
 *
 * @param options - Options to configure the mixin and the
 * authenticators
 *
 * @example
 * import { withTOTP } from '@foadonis/sentinel/totp'
 *
 * class User extends compose(BaseModel, withTOTP({ issuer: 'My app' })) {}
 */
export function withTOTP(options: WithTOTPOptions = {}) {
  const { manager, ...defaults } = options

  return function <Model extends NormalizeConstructor<typeof BaseModel>>(
    superclass: Model
  ): WithTOTPClass<Model> {
    @staticImplements<WithTOTPClass>()
    class WithTOTPImpl extends superclass implements WithTOTPRow {
      static get $totpManager() {
        return resolveManager(manager, () => totp, 'TOTP')
      }

      get $totpManager() {
        return (this.constructor as WithTOTPClass).$totpManager
      }

      getTOTPOptions() {
        return {
          ...this.$totpManager.config,
          ...defaults,
        }
      }

      getTOTPLabel() {
        return this.$getAttribute('email')
      }

      getTOTPManager() {
        return this.$totpManager
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
