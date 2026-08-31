import { BaseModel, column } from '@adonisjs/lucid/orm'
import { RecordId } from '../../../src/types.ts'
import { DateTime } from 'luxon'
import { safeEqual, Secret } from '@adonisjs/core/helpers'
import string from '@adonisjs/core/helpers/string'
import {
  CreateAuthenticatorOptions,
  RegenerateBackupCodesOptions,
  TOTPAuthenticableContract,
  ValidateAuthenticatorTokenOptions,
} from '../types.ts'
import { RuntimeException } from '@adonisjs/core/exceptions'
import {
  TOTP_DEFAULT_ALGORITHM,
  TOTP_DEFAULT_BACKUP_CODES_COUNT,
  TOTP_DEFAULT_BACKUP_CODES_LENGTH,
  TOTP_DEFAULT_DIGITS,
  TOTP_DEFAULT_LOCK_DURATION,
  TOTP_DEFAULT_MAXIMUM_FAILED_VERIFICATIONS,
  TOTP_DEFAULT_PERIOD,
  TOTP_DEFAULT_SECRET_LENGTH,
  TOTP_DEFAULT_WINDOW,
} from '../constants.ts'
import { primaryKeyOf } from '../../../src/helpers.ts'
import { LucidRow } from '@adonisjs/lucid/types/model'
import { normalizeBackupCode } from '../utils.ts'
import { importQRCode } from '../dependencies.ts'
import { E_INVALID_BACKUP_CODE, E_INVALID_TOTP, E_TOTP_LOCKED } from '../errors.ts'
import { TOTP } from 'otpauth'
import { TOTPManager } from '../manager.ts'

/**
 * TOTP authenticator represents the enrollment of an authenticator
 * app for a model. It validates the codes, consumes the backup codes
 * and locks itself after too many failed verifications.
 *
 * An authenticator must be linked to its owner using the "link"
 * method before use, since the options come from the owner. The
 * "withTOTP" mixin links the authenticators it returns.
 *
 * @example
 * const authenticator = await user.createAuthenticator()
 * const qrcode = await authenticator.generateQRCode()
 *
 * await authenticator.validate(code)
 */
export class TOTPAuthenticator extends BaseModel {
  @column({ isPrimary: true })
  declare id: RecordId

  /**
   * Label displayed by the authenticator app, usually the email of
   * the account
   */
  @column()
  declare label: string | null

  /**
   * Reference to the primary key of the owner
   */
  @column()
  declare tokenableId: RecordId

  /**
   * Encrypted list of the remaining backup codes
   */
  @column()
  declare backupCodes: string

  /**
   * Encrypted base32 secret shared with the authenticator app
   */
  @column()
  declare secret: string

  /**
   * Time step of the last accepted code. A bigint column, handed
   * back as a string by the drivers
   */
  @column({
    consume: (value: string | number | null | undefined) =>
      value === null || value === undefined ? null : Number(value),
  })
  declare lastUsedCounter: number | null

  /**
   * Number of consecutive failed verifications
   */
  @column()
  declare failedVerificationCount: number

  /**
   * Timestamp at which the lock lifts. Null when the authenticator
   * is not locked
   */
  @column.dateTime()
  declare lockedUntil: DateTime | null

  /**
   * Timestamp of the first valid code. Null until the enrollment is
   * confirmed
   */
  @column.dateTime()
  declare verifiedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  /**
   * The manager used to encrypt and decrypt the secrets, defined by
   * the service provider
   */
  protected static $manager: TOTPManager

  /**
   * The owner of the authenticator, defined by the "link" method
   */
  protected $tokenable: TOTPAuthenticableContract | undefined

  /**
   * Defines the manager used by the model. Called by the service
   * provider once the manager is resolved.
   */
  static useManager(manager: TOTPManager) {
    this.$manager = manager
  }

  /**
   * Ensures the authenticator has been linked to its owner
   */
  protected $assertLinked(): asserts this is { $tokenable: TOTPAuthenticableContract } {
    if (!this.$tokenable) {
      throw new RuntimeException(
        'You tried to use authenticator without tokenable. Did you forget to call `.link(tokenable)?`'
      )
    }
  }

  /**
   * The owner of the authenticator. Throws when the authenticator
   * has not been linked.
   */
  get tokenable() {
    this.$assertLinked()
    return this.$tokenable
  }

  /**
   * Links the authenticator to its owner, whose options configure
   * the validation
   */
  link(tokenable: TOTPAuthenticableContract) {
    this.$tokenable = tokenable
    return this
  }

  /**
   * The "otpauth" instance configured from the options of the owner
   *
   * @internal
   */
  get $totp() {
    const options = this.tokenable.getTOTPOptions()

    return new TOTP({
      issuer: options.issuer,
      label: this.label || undefined,
      algorithm: options.algorithm ?? TOTP_DEFAULT_ALGORITHM,
      digits: options.digits ?? TOTP_DEFAULT_DIGITS,
      period: options.period ?? TOTP_DEFAULT_PERIOD,
      secret: this.getSecret().release(),
    })
  }

  /**
   * Check if the authenticator is locked. The lock is lifted by time
   * alone.
   */
  isLocked() {
    return !!this.lockedUntil && this.lockedUntil > DateTime.now()
  }

  /**
   * Ensures the authenticator is not locked
   */
  protected $assertUnlocked() {
    if (this.lockedUntil && this.lockedUntil > DateTime.now()) {
      throw new E_TOTP_LOCKED(this.lockedUntil)
    }
  }

  /**
   * Validates a code and confirms the enrollment on the first valid
   * one.
   *
   * Each code is accepted once, as RFC 6238 section 5.2 requires. The
   * time step of the code is written with a compare and swap, so that
   * a replay is refused even while the window still covers it.
   *
   * @param token - The code typed by the user
   * @param options - Options overriding the ones of the owner
   *
   * @throws {E_INVALID_TOTP} When the code is wrong or was accepted
   * already
   * @throws {E_TOTP_LOCKED} When the authenticator is locked, before
   * or by this attempt
   *
   * @see https://datatracker.ietf.org/doc/html/rfc6238#section-5.2
   */
  async validate(token: Secret<string> | string, options: ValidateAuthenticatorTokenOptions = {}) {
    const resolved = { ...this.tokenable.getTOTPOptions(), ...options }

    this.$assertUnlocked()

    const value = typeof token === 'string' ? token : token.release()

    /**
     * Use one instant for both calls, since a step boundary between
     * them would credit the code to the wrong step
     */
    const timestamp = Date.now()
    const delta = this.$totp.validate({
      token: value,
      window: resolved.window ?? TOTP_DEFAULT_WINDOW,
      timestamp,
    })

    if (delta === null) {
      await this.$recordFailedVerification(options)
      throw new E_INVALID_TOTP()
    }

    /**
     * The step the code belongs to. Requiring it to exceed the last
     * one consumed also refuses the older codes the window still
     * covers
     */
    const counter = this.$totp.counter({ timestamp }) + delta

    /**
     * Only consecutive failures lock, so a right code resets the
     * count
     */
    const result = await TOTPAuthenticator.query({ client: this.$trx })
      .where('id', this.id as any)
      .where((query) =>
        query.whereNull('last_used_counter').orWhere('last_used_counter', '<', counter)
      )
      .update({
        last_used_counter: counter,
        failed_verification_count: 0,
        locked_until: null,
      })

    /**
     * Affected rows are a bare count with some drivers and wrapped
     * in an array with others
     */
    const affected = Array.isArray(result) ? result[0] : result

    /**
     * Zero rows means the step was spent already, by a replay or a
     * concurrent validation
     */
    if (!affected) {
      await this.$recordFailedVerification(options)
      throw new E_INVALID_TOTP()
    }

    this.lastUsedCounter = counter
    this.failedVerificationCount = 0
    this.lockedUntil = null

    if (!this.verifiedAt) {
      /**
       * Retire the previous authenticators only now, so that the one
       * in use keeps answering until the new one is proven to work
       */
      this.verifiedAt = DateTime.now()
      await this.save()
      await this.$retirePreviousAuthenticators()
    }

    return true
  }

  /**
   * Deletes the other authenticators of the owner
   */
  protected async $retirePreviousAuthenticators() {
    await TOTPAuthenticator.query({ client: this.$trx })
      .where('tokenable_id', this.tokenableId as any)
      .whereNot('id', this.id as any)
      .delete()
  }

  /**
   * The "otpauth://" URI to share with the authenticator app. It is
   * what the QR code encodes.
   */
  get uri() {
    return this.$totp.toString()
  }

  /**
   * Returns the decrypted secret
   */
  getSecret() {
    return TOTPAuthenticator.$manager.decryptSecret(this.secret)
  }

  /**
   * Renders the URI as a PNG data URL. Requires the optional "qrcode"
   * package.
   */
  async generateQRCode() {
    const uri = this.uri
    const qrcode = await importQRCode()
    return qrcode.toDataURL(uri)
  }

  /**
   * Returns the decrypted list of the remaining backup codes
   */
  getBackupCodes() {
    return new Secret(TOTPAuthenticator.$manager.decryptBackupCodes(this.backupCodes))
  }

  /**
   * Consumes a backup code. The remaining codes are rewritten with a
   * compare and swap, so that two concurrent verifications never
   * spend the same one.
   *
   * @param code - The code typed by the user
   *
   * @throws {E_TOTP_LOCKED} When the authenticator is locked, before
   * or by this attempt
   * @throws {E_INVALID_BACKUP_CODE} When the code is unknown, or a
   * concurrent verification spent it first
   */
  async verifyBackupCode(code: Secret<string> | string) {
    /**
     * Assert the link up front. Only the failure path reads the
     * owner, and an unlinked authenticator must not spend a code
     * before failing
     */
    this.$assertLinked()
    this.$assertUnlocked()

    const value = normalizeBackupCode(typeof code === 'string' ? code : code.release())

    const stored = this.backupCodes
    const codes = TOTPAuthenticator.$manager.decryptBackupCodes(stored)
    const index = codes.findIndex((candidate) => safeEqual(normalizeBackupCode(candidate), value))

    if (index === -1) {
      await this.$recordFailedVerification()
      throw new E_INVALID_BACKUP_CODE()
    }

    const remaining = TOTPAuthenticator.$manager.encryptBackupCodes(codes.toSpliced(index, 1))
    const result = await TOTPAuthenticator.query({ client: this.$trx })
      .where('id', this.id as any)
      .where('backup_codes', stored)
      .update({ backup_codes: remaining, failed_verification_count: 0, locked_until: null })

    /**
     * Affected rows are a bare count with some drivers and wrapped
     * in an array with others
     */
    const affected = Array.isArray(result) ? result[0] : result

    /**
     * Zero rows means a concurrent verification rewrote the codes
     * first
     */
    if (!affected) throw new E_INVALID_BACKUP_CODE()

    this.backupCodes = remaining
    this.failedVerificationCount = 0
    this.lockedUntil = null
  }

  /**
   * Records a failed verification and locks the authenticator once
   * the maximum is reached
   *
   * @throws {E_TOTP_LOCKED} When this failure locks the authenticator
   */
  protected async $recordFailedVerification(options: ValidateAuthenticatorTokenOptions = {}) {
    const resolved = { ...this.tokenable.getTOTPOptions(), ...options }
    const maximum = resolved.maximumFailedVerifications ?? TOTP_DEFAULT_MAXIMUM_FAILED_VERIFICATIONS

    /**
     * Increment in the database, so that concurrent failures all
     * count
     */
    await TOTPAuthenticator.query({ client: this.$trx })
      .where('id', this.id as any)
      .increment('failed_verification_count', 1)

    await this.refresh()

    if (maximum <= 0 || this.failedVerificationCount < maximum) return

    /**
     * Reset the count along with the lock, so that a fresh window of
     * attempts opens once the lock lifts
     */
    this.failedVerificationCount = 0
    this.lockedUntil = DateTime.now().plus({
      seconds: string.seconds.parse(resolved.lockDuration ?? TOTP_DEFAULT_LOCK_DURATION),
    })
    await this.save()

    throw new E_TOTP_LOCKED(this.lockedUntil)
  }

  /**
   * Replaces the backup codes with new ones and returns them
   *
   * @param options - Options overriding the ones of the owner
   */
  async regenerateBackupCodes(options: RegenerateBackupCodesOptions = {}) {
    const resolved = { ...this.tokenable.getTOTPOptions(), ...options }

    const { codes, encryptedCodes } = TOTPAuthenticator.$manager.createBackupCodes(
      resolved.backupCodesCount ?? TOTP_DEFAULT_BACKUP_CODES_COUNT,
      resolved.backupCodesLength ?? TOTP_DEFAULT_BACKUP_CODES_LENGTH
    )

    this.backupCodes = encryptedCodes
    await this.save()

    return new Secret(codes)
  }

  /**
   * Enrolls a new authenticator for a model.
   *
   * The authenticator stays unverified until a first valid code
   * confirms it, see "validate". The authenticator in use keeps
   * answering until then, so a re-enrollment never scanned costs
   * nothing. The enrollments left unconfirmed are replaced, so that
   * opening the enrollment page twice does not pile up secrets.
   *
   * The queries run in the transaction of the model when it has one:
   * a rolled back flow leaves nothing behind, and no query waits on
   * a lock the caller holds.
   *
   * @param tokenable - The model enrolling the authenticator
   * @param options - Options overriding the ones of the model
   */
  static async createFor(
    tokenable: TOTPAuthenticableContract & LucidRow,
    options: CreateAuthenticatorOptions = {}
  ) {
    const resolved = { ...tokenable.getTOTPOptions(), ...options }
    const tokenableId = primaryKeyOf(tokenable, 'create authenticator for')
    const client = tokenable.$trx

    const { encryptedSecret } = TOTPAuthenticator.$manager.createSecret(
      resolved.secretLength ?? TOTP_DEFAULT_SECRET_LENGTH
    )

    const { encryptedCodes } = TOTPAuthenticator.$manager.createBackupCodes(
      resolved.backupCodesCount ?? TOTP_DEFAULT_BACKUP_CODES_COUNT,
      resolved.backupCodesLength ?? TOTP_DEFAULT_BACKUP_CODES_LENGTH
    )

    /**
     * Replace the enrollments left unconfirmed
     */
    await TOTPAuthenticator.query({ client })
      .where('tokenable_id', tokenableId as any)
      .whereNull('verified_at')
      .delete()

    const authenticator = await TOTPAuthenticator.create(
      {
        tokenableId,
        label: tokenable.getTOTPLabel(),
        secret: encryptedSecret,
        backupCodes: encryptedCodes,
        lastUsedCounter: null,
        failedVerificationCount: 0,
        lockedUntil: null,
        verifiedAt: null,
      },
      { client }
    )

    return authenticator.link(tokenable)
  }
}
