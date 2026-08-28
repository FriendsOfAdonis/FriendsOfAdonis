import type { Secret } from '@adonisjs/core/helpers'
import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { BaseModel } from '@adonisjs/lucid/orm'
import { primaryKeyOf, staticImplements } from '../../../src/helpers.ts'
import { E_INVALID_TOKEN } from '../../token/errors.ts'
import type { SentinelToken } from '../../token/token.ts'
import { MagicLinkManager } from '../manager.ts'
import type {
  GenerateMagicLinkOptions,
  GenerateMagicLinkTokenOptions,
  VerifyMagicLinkTokenOptions,
} from '../types.ts'

export interface WithMagicLinkOptions extends GenerateMagicLinkOptions {}

type MagicLinkTokenMetadata = SentinelToken['metadata']

type WithMagicLinkRow = {
  generateMagicLinkToken(options?: GenerateMagicLinkTokenOptions): Promise<Secret<string>>
  generateMagicLink(options?: GenerateMagicLinkOptions): Promise<Secret<string>>
}

type WithMagicLinkClass<
  Model extends NormalizeConstructor<typeof BaseModel> = NormalizeConstructor<typeof BaseModel>,
> = Model & {
  verifyMagicLinkToken<T extends WithMagicLinkClass>(
    this: T,
    value: Secret<string> | string,
    options?: VerifyMagicLinkTokenOptions
  ): Promise<[InstanceType<T>, MagicLinkTokenMetadata]>
  new (...args: any[]): WithMagicLinkRow
}

export function withMagicLink(manager: MagicLinkManager, defaults: WithMagicLinkOptions) {
  return function <Model extends NormalizeConstructor<typeof BaseModel>>(
    superclass: Model
  ): WithMagicLinkClass<Model> {
    @staticImplements<WithMagicLinkClass>()
    class WithMagicLinkImpl extends superclass implements WithMagicLinkRow {
      /**
       * Verifies a magic link token, consumes it and returns the model
       * instance it was generated for along with the metadata given at
       * generation time.
       *
       * @throws {E_INVALID_TOKEN} When the token is unknown, expired,
       * already used, generated for a different purpose or when the
       * subject no longer exists.
       */
      static async verifyMagicLinkToken<T extends WithMagicLinkClass>(
        this: T,
        value: Secret<string> | string,
        options: VerifyMagicLinkTokenOptions = {}
      ): Promise<[InstanceType<T>, MagicLinkTokenMetadata]> {
        const purpose = 'purpose' in options ? options.purpose : defaults.purpose
        const token = await manager.verifyMagicLinkToken(value, { purpose })

        const instance = await this.find(token.tokenableId)
        if (!instance) {
          throw new E_INVALID_TOKEN(MagicLinkManager.TOKEN_KIND, purpose)
        }

        return [instance, token.metadata]
      }

      async generateMagicLinkToken(options: GenerateMagicLinkTokenOptions = {}) {
        return manager.generateMagicLinkToken(
          primaryKeyOf(this, 'generate a magic link token for'),
          { ...defaults, ...options }
        )
      }

      async generateMagicLink(options: Partial<GenerateMagicLinkOptions> = {}) {
        return manager.generateMagicLink(primaryKeyOf(this, 'generate a magic link token for'), {
          ...defaults,
          ...options,
        })
      }
    }

    return WithMagicLinkImpl
  }
}
