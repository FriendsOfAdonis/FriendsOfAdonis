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
import { E_INVALID_BACKUP_CODE, E_INVALID_OTP, E_TOTP_LOCKED } from '../errors.ts'
import { TOTP } from 'otpauth'
import { TOTPManager } from '../manager.ts'

export class TOTPAuthenticator extends BaseModel {
  @column({ isPrimary: true })
  declare id: RecordId

  @column()
  declare label: string | null

  @column()
  declare tokenableId: RecordId

  @column()
  declare backupCodes: string

  @column()
  declare secret: string

  /**
   * Last time step a code was accepted for, "null" until the first one
   * is. Stored as a 64 bits integer, which the drivers hand back as a
   * string.
   */
  @column({
    consume: (value: string | number | null | undefined) =>
      value === null || value === undefined ? null : Number(value),
  })
  declare lastUsedCounter: number | null

  @column()
  declare failedVerificationCount: number

  @column.dateTime()
  declare lockedUntil: DateTime | null

  @column.dateTime()
  declare verifiedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  protected static $manager: TOTPManager

  protected $tokenable: TOTPAuthenticableContract | undefined

  static useManager(manager: TOTPManager) {
    this.$manager = manager
  }

  /**
   * @throws {RuntimeException} When the authenticator has not been
   * linked to its tokenable.
   */
  protected $assertLinked(): asserts this is { $tokenable: TOTPAuthenticableContract } {
    if (!this.$tokenable) {
      throw new RuntimeException(
        'You tried to use authenticator without tokenable. Did you forget to call `.link(tokenable)?`'
      )
    }
  }

  get tokenable() {
    this.$assertLinked()
    return this.$tokenable
  }

  link(tokenable: TOTPAuthenticableContract) {
    this.$tokenable = tokenable
    return this
  }

  /**
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
   * Whether the authenticator refuses codes following too many failed
   * verifications. Locks are lifted by time alone.
   */
  isLocked() {
    return !!this.lockedUntil && this.lockedUntil > DateTime.now()
  }

  /**
   * @throws {E_TOTP_LOCKED} When the authenticator is still locked.
   */
  protected $assertUnlocked() {
    if (this.lockedUntil && this.lockedUntil > DateTime.now()) {
      throw new E_TOTP_LOCKED(this.lockedUntil)
    }
  }

  /**
   * Validates a code and records the outcome: a wrong code counts as a
   * failed verification, a right one clears the failures recorded so far
   * and marks the authenticator as verified.
   *
   * The first valid code confirms the enrollment and retires the
   * authenticators the tokenable enrolled before it, which is what makes
   * a re-enrollment safe: the authenticator in use keeps answering until
   * the new one has been proven to work.
   *
   * A code is accepted once. The time step it was generated for is
   * written with a compare and swap on the stored one, a code handed
   * twice is therefore refused even while the validation window still
   * covers it, as RFC 6238 requires.
   *
   * @throws {E_TOTP_LOCKED} When the authenticator is locked, either
   * before or by this attempt.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc6238#section-5.2
   */
  async validate(token: Secret<string> | string, options: ValidateAuthenticatorTokenOptions = {}) {
    const resolved = { ...options }

    this.$assertUnlocked()

    const value = typeof token === 'string' ? token : token.release()

    /**
     * The same instant is handed to the validation and to the counter,
     * a period elapsing between the two would otherwise shift the step
     * the code is credited to.
     */
    const timestamp = Date.now()
    const delta = this.$totp.validate({
      token: value,
      window: resolved.window ?? TOTP_DEFAULT_WINDOW,
      timestamp,
    })

    if (delta === null) {
      await this.$recordFailedVerification(options)
      throw new E_INVALID_OTP()
    }

    /**
     * Step the code was generated for. The window accepts the steps
     * around the current one, comparing against the last consumed step
     * rather than the current one therefore closes the codes reached by
     * going backwards too.
     */
    const counter = this.$totp.counter({ timestamp }) + delta

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
     * Write queries are handed back as reported by the driver: an array
     * holding the affected rows count for some of them, the count
     * itself for the others.
     */
    const affected = Array.isArray(result) ? result[0] : result

    /**
     * The step was consumed already, by this very code handed a second
     * time or by a concurrent validation that won it.
     */
    if (!affected) {
      await this.$recordFailedVerification(options)
      throw new E_INVALID_OTP()
    }

    /**
     * A right code clears the failures recorded so far, only consecutive
     * ones lock the authenticator.
     */
    this.lastUsedCounter = counter
    this.failedVerificationCount = 0
    this.lockedUntil = null

    if (!this.verifiedAt) {
      this.verifiedAt = DateTime.now()
      await this.save()
      await this.$retirePreviousAuthenticators()
    }

    return true
  }

  /**
   * Deletes the other authenticators of the tokenable, called once this
   * one has been confirmed by a first valid code.
   *
   * An enrollment only replaces the one in use once the tokenable proves
   * it can read the new secret: a re-enrollment left unconfirmed
   * therefore never costs it the authenticator it still logs in with.
   */
  protected async $retirePreviousAuthenticators() {
    await TOTPAuthenticator.query({ client: this.$trx })
      .where('tokenable_id', this.tokenableId as any)
      .whereNot('id', this.id as any)
      .delete()
  }

  /**
   * The "otpauth://" URI holding the enrollment, usually handed to the
   * user as a QR code.
   */
  get uri() {
    return this.$totp.toString()
  }

  getSecret() {
    return TOTPAuthenticator.$manager.decryptSecret(this.secret)
  }

  async generateQRCode() {
    const uri = this.uri
    const qrcode = await importQRCode()
    return qrcode.toDataURL(uri)
  }

  /**
   * Returns the backup codes left. Unlike a password, the codes are
   * stored encrypted and can therefore be displayed again.
   */
  getBackupCodes() {
    return new Secret(TOTPAuthenticator.$manager.decryptBackupCodes(this.backupCodes))
  }

  /**
   * Verifies a backup code and consumes it.
   *
   * The codes left are written with a compare and swap on the stored
   * value, two concurrent verifications can therefore never spend the
   * same code.
   *
   * @throws {E_TOTP_LOCKED} When the authenticator is locked, either
   * before or by this attempt.
   * @throws {E_INVALID_BACKUP_CODE} When the code matches none of the
   * codes left on the authenticator, or when a concurrent verification
   * consumed a code first.
   */
  async verifyBackupCode(code: Secret<string> | string) {
    /**
     * A failed attempt resolves the lock policy from the tokenable: an
     * authenticator left unlinked is refused up front, before any code
     * is compared or spent, rather than half way through the attempt.
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
     * Write queries are handed back as reported by the driver: an array
     * holding the affected rows count for some of them, the count
     * itself for the others.
     */
    const affected = Array.isArray(result) ? result[0] : result

    /**
     * The codes changed under this verification, the one that changed
     * them won the code.
     */
    if (!affected) throw new E_INVALID_BACKUP_CODE()

    this.backupCodes = remaining
    this.failedVerificationCount = 0
    this.lockedUntil = null
  }

  /**
   * Records a failed verification and locks the authenticator once the
   * maximum failed verifications count is reached.
   *
   * The count is incremented by the database rather than in memory, two
   * concurrent verifications can therefore never spend the same attempt.
   *
   * @throws {E_TOTP_LOCKED} When the failure locks the authenticator.
   */
  protected async $recordFailedVerification(options: ValidateAuthenticatorTokenOptions = {}) {
    const resolved = { ...this.tokenable.getTOTPOptions(), ...options }
    const maximum = resolved.maximumFailedVerifications ?? TOTP_DEFAULT_MAXIMUM_FAILED_VERIFICATIONS

    await TOTPAuthenticator.query({ client: this.$trx })
      .where('id', this.id as any)
      .increment('failed_verification_count', 1)

    await this.refresh()

    if (maximum <= 0 || this.failedVerificationCount < maximum) return

    /**
     * The count restarts along with the lock: once it is lifted, the
     * authenticator is given a fresh window of attempts.
     */
    this.failedVerificationCount = 0
    this.lockedUntil = DateTime.now().plus({
      seconds: string.seconds.parse(resolved.lockDuration ?? TOTP_DEFAULT_LOCK_DURATION),
    })
    await this.save()

    throw new E_TOTP_LOCKED(this.lockedUntil)
  }

  /**
   * Replaces the backup codes of the authenticator, invalidating the
   * ones handed previously.
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
   * Enrolls a new authenticator, which stays unverified until a first
   * valid code confirms it.
   *
   * The authenticator the tokenable currently logs in with is left
   * untouched: it is retired by the confirmation rather than by this
   * call, see {@link TOTPAuthenticator.validate}. Only the enrollments
   * left unconfirmed are replaced, so that a tokenable opening the
   * enrollment page twice does not pile up secrets it never scanned.
   *
   * The enrollment joins the transaction the tokenable is bound to: a
   * flow rolled back leaves no authenticator behind, and the queries do
   * not wait on a lock the caller is holding.
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
