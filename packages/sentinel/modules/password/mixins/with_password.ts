import { RuntimeException } from '@adonisjs/core/exceptions'
import type { Secret } from '@adonisjs/core/helpers'
import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import { type BaseModel, beforeSave } from '@adonisjs/lucid/orm'
import type { LucidRow } from '@adonisjs/lucid/types/model'
import sentinel from '../../../services/main.ts'
import { DEFAULT_PASSWORD_COLUMN_NAME, DEFAULT_PASSWORD_UIDS } from '../constants.ts'
import { primaryKeyOf, staticImplements } from '../../../src/helpers.ts'
import { E_INVALID_TOKEN } from '../../token/errors.ts'
import type { SentinelToken } from '../../token/token.ts'
import { E_INVALID_CREDENTIALS, E_INVALID_PASSWORD } from '../errors.ts'
import { PasswordManager } from '../manager.ts'
import type {
  GeneratePasswordResetTokenOptions,
  InvalidatePasswordResetTokensOptions,
  VerifyPasswordResetTokenOptions,
} from '../types.ts'

export interface WithPasswordOptions extends GeneratePasswordResetTokenOptions {
  /**
   * Columns a user can be looked up by when verifying credentials.
   *
   * @default ["email"]
   */
  uids?: string[]

  /**
   * Model property holding the password.
   *
   * @default "password"
   */
  passwordColumnName?: string

  /**
   * Whether "verifyCredentials" should hash the password again when the
   * persisted hash was created with outdated options, for example after
   * the cost of the hasher has been raised.
   *
   * @default true
   */
  rehashOnVerify?: boolean
}

type PasswordResetTokenMetadata = SentinelToken['metadata']

type WithPasswordRow = {
  verifyPassword(plainPassword: string): Promise<boolean>
  validatePassword(plainPassword: string, passwordFieldName?: string): Promise<void>
  updatePassword(currentPassword: string, password: string): Promise<void>
  generatePasswordResetToken(options?: GeneratePasswordResetTokenOptions): Promise<Secret<string>>
  invalidatePasswordResetTokens(options?: InvalidatePasswordResetTokensOptions): Promise<void>
  getPassword(): string | null
}

type WithPasswordClass<
  Model extends NormalizeConstructor<typeof BaseModel> = NormalizeConstructor<typeof BaseModel>,
> = Model & {
  hashPassword<T extends WithPasswordClass>(this: T, row: InstanceType<T>): Promise<void>
  findForAuth<T extends WithPasswordClass>(
    this: T,
    uids: string[],
    value: string
  ): Promise<InstanceType<T> | null>
  verifyCredentials<T extends WithPasswordClass>(
    this: T,
    uid: string,
    password: string
  ): Promise<InstanceType<T>>
  verifyPasswordResetToken<T extends WithPasswordClass>(
    this: T,
    value: Secret<string> | string,
    options?: VerifyPasswordResetTokenOptions
  ): Promise<[InstanceType<T>, PasswordResetTokenMetadata]>
  resetPassword<T extends WithPasswordClass>(
    this: T,
    value: Secret<string> | string,
    password: string,
    options?: VerifyPasswordResetTokenOptions
  ): Promise<[InstanceType<T>, PasswordResetTokenMetadata]>
  new (...args: any[]): WithPasswordRow
}

/**
 * Adds password management to a model: hashing, credentials
 * verification, password updates and the "forgot password" flow.
 *
 * The mixin is a drop-in replacement for the "withAuthFinder" mixin of
 * "@adonisjs/auth/mixins/lucid": it defines the same `beforeSave` hook,
 * the same `findForAuth`, `verifyCredentials`, `verifyPassword` and
 * `validatePassword` methods, and raises the same
 * `E_INVALID_CREDENTIALS` exception. Compose one or the other, never
 * both, or passwords would be hashed twice.
 *
 * The hasher is the one configured under `password.hasher` inside
 * `config/sentinel.ts`, instead of being handed over to the mixin.
 */
export function withPassword(options: WithPasswordOptions = {}) {
  const {
    uids = DEFAULT_PASSWORD_UIDS,
    passwordColumnName = DEFAULT_PASSWORD_COLUMN_NAME,
    rehashOnVerify = true,
    ...defaults
  } = options

  return function <Model extends NormalizeConstructor<typeof BaseModel>>(
    superclass: Model
  ): WithPasswordClass<Model> {
    @staticImplements<WithPasswordClass>()
    class WithPasswordImpl extends superclass implements WithPasswordRow {
      /**
       * Hashes the password of the model before it is persisted,
       * whenever it has been assigned a new value.
       */
      @beforeSave()
      static async hashPassword<T extends WithPasswordClass>(this: T, row: InstanceType<T>) {
        if (row.$dirty[passwordColumnName]) {
          ;(row as any)[passwordColumnName] = await sentinel.password.hashPassword(
            (row as any)[passwordColumnName]
          )
        }
      }

      /**
       * Finds a user from one of the uids of the mixin.
       */
      static findForAuth<T extends WithPasswordClass>(this: T, uidsList: string[], value: string) {
        const query = this.query()
        uidsList.forEach((uid) => query.orWhere(uid, value))

        return query.limit(1).first() as Promise<InstanceType<T> | null>
      }

      /**
       * Finds a user from one of the uids of the mixin and verifies its
       * password. Takes the same time to answer whether the user exists
       * or not, so that credentials cannot be told apart by timing the
       * response.
       *
       * The password is hashed again when the persisted hash was created
       * with outdated options, unless "rehashOnVerify" is disabled.
       *
       * @throws {E_INVALID_CREDENTIALS} When the credentials do not
       * match any user.
       */
      static async verifyCredentials<T extends WithPasswordClass>(
        this: T,
        uid: string,
        password: string
      ): Promise<InstanceType<T>> {
        if (!uid || !password) {
          throw new E_INVALID_CREDENTIALS()
        }

        const row = await this.findForAuth(uids, uid)

        if (!row) {
          await sentinel.password.hashPassword(password)
          throw new E_INVALID_CREDENTIALS()
        }

        if (!(await row.verifyPassword(password))) {
          throw new E_INVALID_CREDENTIALS()
        }

        const current = row.getPassword()

        if (!current) {
          throw new RuntimeException(
            `Cannot verify password. The value for "${passwordColumnName}" column is undefined or null`
          )
        }

        if (rehashOnVerify && sentinel.password.needsRehash(current)) {
          await savePassword(row, passwordColumnName, password)
        }

        return row
      }

      /**
       * Verifies a password reset token, consumes it and returns the
       * model instance it was generated for along with the metadata
       * given at generation time.
       *
       * @throws {E_INVALID_TOKEN} When the token is unknown, expired,
       * already used, generated for a different purpose or when the
       * subject no longer exists.
       */
      static async verifyPasswordResetToken<T extends WithPasswordClass>(
        this: T,
        value: Secret<string> | string,
        options: VerifyPasswordResetTokenOptions = {}
      ): Promise<[InstanceType<T>, PasswordResetTokenMetadata]> {
        const purpose = 'purpose' in options ? options.purpose : defaults.purpose
        const token = await sentinel.password.verifyPasswordResetToken(value, { purpose })

        const instance = await this.find(token.tokenableId)
        if (!instance) {
          throw new E_INVALID_TOKEN(PasswordManager.TOKEN_KIND, purpose)
        }

        return [instance, token.metadata]
      }

      /**
       * Verifies a password reset token, consumes it and saves the new
       * password of the model instance it was generated for. Every other
       * pending reset token of the instance is invalidated.
       *
       * @throws {E_INVALID_TOKEN} When the token is unknown, expired,
       * already used, generated for a different purpose or when the
       * subject no longer exists.
       */
      static async resetPassword<T extends WithPasswordClass>(
        this: T,
        value: Secret<string> | string,
        password: string,
        options: VerifyPasswordResetTokenOptions = {}
      ): Promise<[InstanceType<T>, PasswordResetTokenMetadata]> {
        const [instance, metadata] = await this.verifyPasswordResetToken(value, options)

        await savePassword(instance, passwordColumnName, password)
        await instance.invalidatePasswordResetTokens()

        return [instance, metadata]
      }

      /**
       * Verifies a password against the one of the model.
       */
      verifyPassword(plainPassword: string) {
        const password = this.getPassword()

        if (!password) {
          throw new RuntimeException(
            `Cannot verify password. The value for "${passwordColumnName}" column is undefined or null`
          )
        }

        return sentinel.password.verifyPassword(password, plainPassword)
      }

      /**
       * Verifies a password against the one of the model and raises a
       * validation error when it does not match. Handy inside the
       * controllers changing a password from a form.
       */
      async validatePassword(plainPassword: string, passwordFieldName?: string) {
        if (!(await this.verifyPassword(plainPassword))) {
          const error = new Error('Validation Error')
          Object.defineProperty(error, 'code', { value: 'E_VALIDATION_ERROR' })
          Object.defineProperty(error, 'status', { value: 422 })
          Object.defineProperty(error, 'messages', {
            value: [
              {
                field: passwordFieldName ?? 'currentPassword',
                message: 'The current password is incorrect',
                rule: 'current_password',
              },
            ],
          })

          throw error
        }
      }

      /**
       * Saves a new password once the current one has been verified.
       * Every pending reset token of the model is invalidated.
       *
       * @throws {E_INVALID_PASSWORD} When the current password is wrong.
       */
      async updatePassword(currentPassword: string, password: string) {
        if (!(await this.verifyPassword(currentPassword))) {
          throw new E_INVALID_PASSWORD()
        }

        await savePassword(this, passwordColumnName, password)
        await this.invalidatePasswordResetTokens()
      }

      async generatePasswordResetToken(options: GeneratePasswordResetTokenOptions = {}) {
        return sentinel.password.generatePasswordResetToken(
          primaryKeyOf(this, 'generate a password reset token for'),
          { ...defaults, ...options }
        )
      }

      /**
       * Invalidates the pending password reset tokens of the model,
       * of every purpose unless one is given.
       */
      async invalidatePasswordResetTokens(options: InvalidatePasswordResetTokensOptions = {}) {
        return sentinel.password.invalidatePasswordResetTokens(
          primaryKeyOf(this, 'invalidate the password reset tokens of'),
          options
        )
      }

      getPassword(): string | null {
        return (
          this.$getAttribute(options.passwordColumnName ?? DEFAULT_PASSWORD_COLUMN_NAME) ?? null
        )
      }
    }

    return WithPasswordImpl
  }
}

/**
 * Assigns a plain password to a model instance and saves it. Hashing is
 * the job of the "beforeSave" hook of the mixin.
 */
async function savePassword(instance: LucidRow, passwordColumnName: string, password: string) {
  instance.merge({ [passwordColumnName]: password } as any)
  await instance.save()
}
