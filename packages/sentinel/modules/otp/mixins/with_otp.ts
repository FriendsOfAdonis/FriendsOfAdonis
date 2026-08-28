import type { Secret } from '@adonisjs/core/helpers'
import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { BaseModel } from '@adonisjs/lucid/orm'
import { primaryKeyOf, staticImplements } from '../../../src/helpers.ts'
import type { RecordId } from '../../../src/types.ts'
import { E_INVALID_TOKEN } from '../../token/errors.ts'
import type { SentinelToken } from '../../token/token.ts'
import { OTPManager } from '../manager.ts'
import type { GenerateOTPOptions, VerifyOTPOptions } from '../types.ts'

export interface WithOTPOptions extends GenerateOTPOptions {}

type OTPTokenMetadata = SentinelToken['metadata']

type WithOTPRow = {
  generateOTP(options?: GenerateOTPOptions): Promise<Secret<string>>
}

type WithOTPClass<
  Model extends NormalizeConstructor<typeof BaseModel> = NormalizeConstructor<typeof BaseModel>,
> = Model & {
  verifyOTP<T extends WithOTPClass>(
    this: T,
    tokenableId: RecordId,
    value: Secret<string> | string,
    options?: VerifyOTPOptions
  ): Promise<[InstanceType<T>, OTPTokenMetadata]>
  new (...args: any[]): WithOTPRow
}

export function withOTP(manager: OTPManager, defaults: WithOTPOptions = {}) {
  return function <Model extends NormalizeConstructor<typeof BaseModel>>(
    superclass: Model
  ): WithOTPClass<Model> {
    @staticImplements<WithOTPClass>()
    class WithOTPImpl extends superclass implements WithOTPRow {
      /**
       * Verifies an OTP of the given subject, consumes it and returns the
       * model instance it was generated for along with the metadata given
       * at generation time.
       *
       * @throws {E_TOO_MANY_ATTEMPTS} When the code is wrong and the OTP
       * reaches its maximum failed attempts count.
       * @throws {E_INVALID_TOKEN} When the OTP is unknown, expired,
       * already used, generated for a different purpose or when the
       * subject no longer exists.
       */
      static async verifyOTP<T extends WithOTPClass>(
        this: T,
        tokenableId: RecordId,
        value: Secret<string> | string,
        options: VerifyOTPOptions = {}
      ): Promise<[InstanceType<T>, OTPTokenMetadata]> {
        const purpose = 'purpose' in options ? options.purpose : defaults.purpose
        const token = await manager.verifyOTP(tokenableId, value, { purpose })

        const instance = await this.find(token.tokenableId)
        if (!instance) {
          throw new E_INVALID_TOKEN(OTPManager.TOKEN_KIND, purpose)
        }

        return [instance, token.metadata]
      }

      async generateOTP(options: GenerateOTPOptions = {}) {
        return manager.generateOTP(primaryKeyOf(this, 'generate an OTP for'), {
          ...defaults,
          ...options,
        })
      }
    }

    return WithOTPImpl
  }
}
