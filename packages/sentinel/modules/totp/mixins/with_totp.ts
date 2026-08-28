import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { BaseModel } from '@adonisjs/lucid/orm'
import { primaryKeyOf, staticImplements } from '../../../src/helpers.ts'
import { TOTPAuthenticator } from '../models/totp_authenticator.ts'
import {
  AuthenticatorOptions,
  CreateAuthenticatorOptions,
  TOTPAuthenticableContract,
} from '../types.ts'

export interface WithTOTPOptions extends AuthenticatorOptions {}

type WithTOTPRow = TOTPAuthenticableContract & {
  createAuthenticator(options?: CreateAuthenticatorOptions): Promise<TOTPAuthenticator>
  retrieveAuthenticator(unverified?: boolean): Promise<TOTPAuthenticator | null>
}

type WithTOTPClass<
  Model extends NormalizeConstructor<typeof BaseModel> = NormalizeConstructor<typeof BaseModel>,
> = Model & {
  new (...args: any[]): WithTOTPRow
}

export function withTOTP(defaults: WithTOTPOptions) {
  return function <Model extends NormalizeConstructor<typeof BaseModel>>(
    superclass: Model
  ): WithTOTPClass<Model> {
    @staticImplements<WithTOTPClass>()
    class WithTOTPImpl extends superclass implements WithTOTPRow {
      $totpOptions: AuthenticatorOptions = defaults

      async createAuthenticator(
        options: CreateAuthenticatorOptions = {}
      ): Promise<TOTPAuthenticator> {
        return TOTPAuthenticator.createFor(this, options)
      }

      /**
       * Returns the authenticator the model logs in with, "null" until
       * an enrollment has been confirmed by a first valid code.
       *
       * Pass "unverified" to reach the enrollment being confirmed, which
       * is the one the model has just been handed a QR code for.
       *
       * The newest authenticator wins: confirming an enrollment retires
       * the previous ones, so only an enrollment in flight can sit next
       * to the one in use.
       */
      async retrieveAuthenticator(unverified = false): Promise<TOTPAuthenticator | null> {
        const authenticator = await TOTPAuthenticator.query()
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
