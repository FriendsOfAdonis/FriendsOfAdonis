import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import { TOTP, URI } from 'otpauth'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose, Secret } from '@adonisjs/core/helpers'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { TOTPManagerFactory } from '../../factories/totp.ts'
import type { TOTPManagerConfig } from '../../modules/totp/manager.ts'
import type { WithTOTPOptions } from '../../modules/totp/mixins/with_totp.ts'
import { TOTPAuthenticator } from '../../modules/totp/models/totp_authenticator.ts'
import { E_INVALID_BACKUP_CODE, E_INVALID_TOTP, E_TOTP_LOCKED } from '../../modules/totp/errors.ts'
import { createDatabase, createTables, freezeTime, rejection } from '../helpers.ts'

type TOTPLockedException = InstanceType<typeof E_TOTP_LOCKED>

/**
 * Mid-step, so that 30 seconds either way lands in the neighbouring
 * steps
 */
const NOW = new Date(1_800_000_000_000 + 15_000)
const STEP = 30_000

/**
 * "I" is outside the backup code alphabet, so the code is never issued
 */
const UNKNOWN_BACKUP_CODE = 'IIIII-IIIII'

function after(at: Date, seconds: number) {
  return new Date(at.getTime() + seconds * 1000)
}

function stepOf(at: Date) {
  return Math.floor(at.getTime() / STEP)
}

function codeAt(
  authenticator: TOTPAuthenticator,
  at: Date,
  options: { digits?: number; period?: number; algorithm?: string } = {}
) {
  const totp = new TOTP({ secret: authenticator.getSecret().release(), ...options })
  return totp.generate({ timestamp: at.getTime() })
}

function wrongCodeAt(authenticator: TOTPAuthenticator, at: Date) {
  const valid = new Set([-1, 0, 1].map((step) => codeAt(authenticator, after(at, step * 30))))
  return ['000000', '000001', '000002', '000003'].find((code) => !valid.has(code))!
}

function setupModel(config: Partial<TOTPManagerConfig> = {}, defaults: WithTOTPOptions = {}) {
  const manager = new TOTPManagerFactory().create({ issuer: 'FriendsOfAdonis', ...config })
  TOTPAuthenticator.useManager(manager)

  class User extends compose(BaseModel, manager.withTOTP(defaults)) {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare email: string
  }

  return { manager, User }
}

async function enroll(config: Partial<TOTPManagerConfig> = {}, defaults: WithTOTPOptions = {}) {
  const db = await createDatabase()
  await createTables(db)

  const { manager, User } = setupModel(config, defaults)
  const user = await User.create({ email: 'virk@adonisjs.com' })
  const authenticator = await user.createAuthenticator()

  return { db, manager, User, user, authenticator }
}

async function lock(authenticator: TOTPAuthenticator, at: Date, maximum = 5) {
  const wrong = wrongCodeAt(authenticator, at)

  for (let attempt = 1; attempt < maximum; attempt++) {
    const error = await rejection(() => authenticator.validate(wrong))
    if (!(error instanceof E_INVALID_TOTP)) throw error
  }

  const error = await rejection<TOTPLockedException>(() => authenticator.validate(wrong))
  if (!(error instanceof E_TOTP_LOCKED)) throw error

  return error
}

test.group('TOTP authenticator | enroll', () => {
  test('enroll an unverified authenticator for the tokenable', async ({ assert }) => {
    const { db, user, authenticator } = await enroll()

    assert.instanceOf(authenticator, TOTPAuthenticator)
    assert.strictEqual(authenticator.tokenable, user)
    assert.equal(authenticator.tokenableId, user.id)
    assert.equal(authenticator.label, 'virk@adonisjs.com')
    assert.isNull(authenticator.verifiedAt)
    assert.isNull(authenticator.lastUsedCounter)
    assert.isNull(authenticator.lockedUntil)
    assert.equal(authenticator.failedVerificationCount, 0)
    assert.isFalse(authenticator.isLocked())
    assert.isTrue(DateTime.isDateTime(authenticator.createdAt))

    const rows = await db.from('totp_authenticators')
    assert.lengthOf(rows, 1)
    assert.equal(rows[0].tokenable_id, user.id)
    assert.equal(rows[0].label, 'virk@adonisjs.com')
    assert.isNull(rows[0].verified_at)
    assert.isNull(rows[0].last_used_counter)
    assert.isNull(rows[0].locked_until)
    assert.equal(rows[0].failed_verification_count, 0)
  })

  test('store the secret and the backup codes encrypted', async ({ assert }) => {
    const { db, manager, authenticator } = await enroll()
    const row = await db.from('totp_authenticators').first()

    const secret = authenticator.getSecret()
    assert.instanceOf(secret, Secret)
    assert.match(secret.release(), /^[A-Z2-7]{64}$/)
    assert.notInclude(row.secret, secret.release())
    assert.equal(manager.decryptSecret(row.secret).release(), secret.release())

    const codes = authenticator.getBackupCodes()
    assert.instanceOf(codes, Secret)
    assert.lengthOf(codes.release(), 10)
    assert.deepEqual(manager.decryptBackupCodes(row.backup_codes), codes.release())
    for (const code of codes.release()) {
      assert.match(code, /^[0-9A-HJKMNP-TV-Z]{5}-[0-9A-HJKMNP-TV-Z]{5}$/)
      assert.notInclude(row.backup_codes, code)
    }
  })

  test('size the secret and the backup codes from the tokenable options', async ({ assert }) => {
    const { authenticator } = await enroll({
      secretLength: 20,
      backupCodesCount: 4,
      backupCodesLength: 8,
    })

    const codes = authenticator.getBackupCodes().release()
    assert.lengthOf(authenticator.getSecret().release(), 32)
    assert.lengthOf(codes, 4)
    for (const code of codes) {
      assert.lengthOf(code.replace('-', ''), 8)
    }
  })

  test('give precedence to the options of the enrollment', async ({ assert }) => {
    const { user } = await enroll({ secretLength: 20, backupCodesCount: 4, backupCodesLength: 8 })
    const authenticator = await user.createAuthenticator({
      secretLength: 10,
      backupCodesCount: 2,
      backupCodesLength: 12,
    })

    const codes = authenticator.getBackupCodes().release()
    assert.lengthOf(authenticator.getSecret().release(), 16)
    assert.lengthOf(codes, 2)
    for (const code of codes) {
      assert.lengthOf(code.replace('-', ''), 12)
    }
  })

  test('replace the enrollments left unconfirmed', async ({ assert }) => {
    const { db, user, authenticator } = await enroll()
    const replacement = await user.createAuthenticator()

    const rows = await db.from('totp_authenticators')
    assert.lengthOf(rows, 1)
    assert.equal(rows[0].id, replacement.id)
    assert.notEqual(rows[0].id, authenticator.id)
  })

  test('keep the authenticator in use when re-enrolling', async ({ assert }) => {
    freezeTime(NOW)

    const { db, user, authenticator } = await enroll()
    await authenticator.validate(codeAt(authenticator, NOW))

    const first = await user.createAuthenticator()
    const second = await user.createAuthenticator()

    const ids = (await db.from('totp_authenticators').orderBy('id')).map((row) => row.id)
    assert.deepEqual(ids, [authenticator.id, second.id])
    assert.notInclude(ids, first.id)
  })

  test('join the transaction the tokenable is bound to', async ({ assert }) => {
    const { db, user } = await enroll()

    const trx = await db.transaction()
    user.useTransaction(trx)

    const authenticator = await user.createAuthenticator()
    assert.strictEqual(authenticator.$trx, trx)

    await trx.rollback()

    const rows = await db.from('totp_authenticators')
    assert.lengthOf(rows, 1)
    assert.notEqual(rows[0].id, authenticator.id)
  })

  test('refuse a tokenable without primary key', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)

    const { User } = setupModel()
    const user = new User()

    await assert.rejects(
      () => user.createAuthenticator(),
      RuntimeException,
      /Cannot create authenticator for an unsaved "User": the primary key is empty/
    )
  })
})

test.group('TOTP authenticator | validate', () => {
  test('accept the code of the current step and confirm the enrollment', async ({ assert }) => {
    freezeTime(NOW)
    const { db, authenticator } = await enroll()

    assert.isTrue(await authenticator.validate(codeAt(authenticator, NOW)))
    assert.isTrue(DateTime.isDateTime(authenticator.verifiedAt))
    assert.equal(authenticator.lastUsedCounter, stepOf(NOW))
    assert.equal(authenticator.failedVerificationCount, 0)
    assert.isNull(authenticator.lockedUntil)

    const row = await db.from('totp_authenticators').first()
    assert.isNotNull(row.verified_at)
    assert.equal(Number(row.last_used_counter), stepOf(NOW))
    assert.equal(row.failed_verification_count, 0)
    assert.isNull(row.locked_until)
  })

  test('accept a code wrapped in a secret', async ({ assert }) => {
    freezeTime(NOW)
    const { authenticator } = await enroll()

    assert.isTrue(await authenticator.validate(new Secret(codeAt(authenticator, NOW))))
  })

  test('accept the code of the previous step', async ({ assert }) => {
    freezeTime(NOW)
    const { authenticator } = await enroll()

    assert.isTrue(await authenticator.validate(codeAt(authenticator, after(NOW, -30))))
    assert.equal(authenticator.lastUsedCounter, stepOf(NOW) - 1)
  })

  test('accept the code of the next step', async ({ assert }) => {
    freezeTime(NOW)
    const { authenticator } = await enroll()

    assert.isTrue(await authenticator.validate(codeAt(authenticator, after(NOW, 30))))
    assert.equal(authenticator.lastUsedCounter, stepOf(NOW) + 1)
  })

  test('refuse a code from outside the validation window', async ({ assert }) => {
    freezeTime(NOW)
    const { db, authenticator } = await enroll()

    await assert.rejects(
      () => authenticator.validate(codeAt(authenticator, after(NOW, -60))),
      E_INVALID_TOTP
    )
    await assert.rejects(
      () => authenticator.validate(codeAt(authenticator, after(NOW, 60))),
      E_INVALID_TOTP
    )

    const row = await db.from('totp_authenticators').first()
    assert.isNull(row.verified_at)
    assert.isNull(row.last_used_counter)
    assert.equal(row.failed_verification_count, 2)
  })

  test('refuse a wrong code and record the failure', async ({ assert }) => {
    freezeTime(NOW)
    const { db, authenticator } = await enroll()

    await assert.rejects(
      () => authenticator.validate(wrongCodeAt(authenticator, NOW)),
      E_INVALID_TOTP
    )

    assert.equal(authenticator.failedVerificationCount, 1)
    assert.isNull(authenticator.verifiedAt)

    const row = await db.from('totp_authenticators').first()
    assert.equal(row.failed_verification_count, 1)
    assert.isNull(row.verified_at)
  })

  test('refuse a code of the wrong length', async ({ assert }) => {
    freezeTime(NOW)
    const { authenticator } = await enroll()

    await assert.rejects(() => authenticator.validate(''), E_INVALID_TOTP)
    await assert.rejects(() => authenticator.validate('12345'), E_INVALID_TOTP)
    await assert.rejects(() => authenticator.validate('1234567'), E_INVALID_TOTP)

    assert.equal(authenticator.failedVerificationCount, 3)
  })

  test('refuse a code handed twice', async ({ assert }) => {
    freezeTime(NOW)
    const { db, authenticator } = await enroll()
    const code = codeAt(authenticator, NOW)

    assert.isTrue(await authenticator.validate(code))
    await assert.rejects(() => authenticator.validate(code), E_INVALID_TOTP)

    const row = await db.from('totp_authenticators').first()
    assert.equal(row.failed_verification_count, 1)
    assert.equal(Number(row.last_used_counter), stepOf(NOW))
  })

  test('refuse a code handed again from the next step', async ({ assert }) => {
    freezeTime(NOW)
    const { authenticator } = await enroll()
    const code = codeAt(authenticator, NOW)

    assert.isTrue(await authenticator.validate(code))

    /**
     * Still inside the window, so the refusal is the replay, not the
     * expiry
     */
    freezeTime(after(NOW, 30))
    await assert.rejects(() => authenticator.validate(code), E_INVALID_TOTP)
  })

  test('refuse the codes of the steps before the last accepted one', async ({ assert }) => {
    freezeTime(NOW)
    const { authenticator } = await enroll()

    assert.isTrue(await authenticator.validate(codeAt(authenticator, NOW)))
    await assert.rejects(
      () => authenticator.validate(codeAt(authenticator, after(NOW, -30))),
      E_INVALID_TOTP
    )
  })

  test('accept the code of the next step once the current one is consumed', async ({ assert }) => {
    freezeTime(NOW)
    const { authenticator } = await enroll()

    assert.isTrue(await authenticator.validate(codeAt(authenticator, NOW)))

    freezeTime(after(NOW, 30))
    assert.isTrue(await authenticator.validate(codeAt(authenticator, after(NOW, 30))))
    assert.equal(authenticator.lastUsedCounter, stepOf(NOW) + 1)
  })

  test('widen the window with the validation options', async ({ assert }) => {
    freezeTime(NOW)
    const { authenticator } = await enroll()

    assert.isTrue(
      await authenticator.validate(codeAt(authenticator, after(NOW, -60)), { window: 2 })
    )
  })

  test('close the window with the validation options', async ({ assert }) => {
    freezeTime(NOW)
    const { authenticator } = await enroll()

    await assert.rejects(
      () => authenticator.validate(codeAt(authenticator, after(NOW, -30)), { window: 0 }),
      E_INVALID_TOTP
    )
    assert.isTrue(await authenticator.validate(codeAt(authenticator, NOW), { window: 0 }))
  })

  test('close the window from the tokenable options', async ({ assert }) => {
    freezeTime(NOW)
    const { authenticator } = await enroll({ window: 0 })

    await assert.rejects(
      () => authenticator.validate(codeAt(authenticator, after(NOW, -30))),
      E_INVALID_TOTP
    )
  })

  test('widen the window from the tokenable options', async ({ assert }) => {
    freezeTime(NOW)
    const { authenticator } = await enroll({ window: 2 })

    assert.isTrue(await authenticator.validate(codeAt(authenticator, after(NOW, -60))))
  })

  test('give precedence to the window of the validation options', async ({ assert }) => {
    freezeTime(NOW)
    const { authenticator } = await enroll({ window: 0 })

    assert.isTrue(
      await authenticator.validate(codeAt(authenticator, after(NOW, -30)), { window: 1 })
    )
  })

  test('validate codes with the shape of the tokenable options', async ({ assert }) => {
    freezeTime(NOW)
    const shape = { digits: 8, period: 60, algorithm: 'SHA256' as const }
    const { authenticator } = await enroll(shape)

    await assert.rejects(() => authenticator.validate(codeAt(authenticator, NOW)), E_INVALID_TOTP)
    assert.isTrue(await authenticator.validate(codeAt(authenticator, NOW, shape)))
    assert.equal(authenticator.lastUsedCounter, Math.floor(NOW.getTime() / 60_000))
  })

  test('give precedence to the mixin defaults for the shape of the codes', async ({ assert }) => {
    freezeTime(NOW)
    const { authenticator } = await enroll({ digits: 6 }, { digits: 8 })

    await assert.rejects(() => authenticator.validate(codeAt(authenticator, NOW)), E_INVALID_TOTP)
    assert.isTrue(await authenticator.validate(codeAt(authenticator, NOW, { digits: 8 })))
  })

  test('retire the previous authenticators once the enrollment is confirmed', async ({
    assert,
  }) => {
    freezeTime(NOW)
    const { db, user, authenticator } = await enroll()
    await authenticator.validate(codeAt(authenticator, NOW))

    const replacement = await user.createAuthenticator()
    assert.lengthOf(await db.from('totp_authenticators'), 2)

    assert.isTrue(await replacement.validate(codeAt(replacement, NOW)))

    const rows = await db.from('totp_authenticators')
    assert.lengthOf(rows, 1)
    assert.equal(rows[0].id, replacement.id)
    assert.equal((await user.retrieveAuthenticator())!.id, replacement.id)
  })

  test('keep the authenticator in use while a re-enrollment is left unconfirmed', async ({
    assert,
  }) => {
    freezeTime(NOW)
    const { db, user, authenticator } = await enroll()
    await authenticator.validate(codeAt(authenticator, NOW))

    const replacement = await user.createAuthenticator()

    freezeTime(after(NOW, 30))
    assert.isTrue(await authenticator.validate(codeAt(authenticator, after(NOW, 30))))

    assert.lengthOf(await db.from('totp_authenticators'), 2)
    assert.equal((await user.retrieveAuthenticator())!.id, authenticator.id)
    assert.equal((await user.retrieveAuthenticator(true))!.id, replacement.id)
  })

  test('clear the failures recorded so far with a right code', async ({ assert }) => {
    freezeTime(NOW)
    const { db, authenticator } = await enroll()
    const wrong = wrongCodeAt(authenticator, NOW)

    for (let attempt = 0; attempt < 4; attempt++) {
      await assert.rejects(() => authenticator.validate(wrong), E_INVALID_TOTP)
    }
    assert.equal((await db.from('totp_authenticators').first()).failed_verification_count, 4)

    assert.isTrue(await authenticator.validate(codeAt(authenticator, NOW)))
    assert.equal((await db.from('totp_authenticators').first()).failed_verification_count, 0)

    /**
     * Four more would have locked, had the count not been cleared
     */
    for (let attempt = 0; attempt < 4; attempt++) {
      await assert.rejects(() => authenticator.validate(wrong), E_INVALID_TOTP)
    }
    assert.isFalse(authenticator.isLocked())
  })

  test('refuse a code consumed through another instance of the authenticator', async ({
    assert,
  }) => {
    freezeTime(NOW)
    const { db, user, authenticator } = await enroll()
    const other = (await TOTPAuthenticator.findOrFail(authenticator.id)).link(user)
    const code = codeAt(authenticator, NOW)

    assert.isTrue(await authenticator.validate(code))
    await assert.rejects(() => other.validate(code), E_INVALID_TOTP)

    const row = await db.from('totp_authenticators').first()
    assert.equal(Number(row.last_used_counter), stepOf(NOW))
    assert.equal(row.failed_verification_count, 1)
  })

  test('stay bound to the transaction of the enrollment', async ({ assert }) => {
    freezeTime(NOW)
    const { db, user } = await enroll()

    const trx = await db.transaction()
    user.useTransaction(trx)

    const authenticator = await user.createAuthenticator()
    assert.isTrue(await authenticator.validate(codeAt(authenticator, NOW)))

    await trx.rollback()

    const rows = await db.from('totp_authenticators')
    assert.lengthOf(rows, 1)
    assert.notEqual(rows[0].id, authenticator.id)
    assert.isNull(rows[0].verified_at)
  })

  test('refuse an authenticator left unlinked', async ({ assert }) => {
    freezeTime(NOW)
    const { db, authenticator } = await enroll()
    const unlinked = await TOTPAuthenticator.findOrFail(authenticator.id)

    await assert.rejects(
      () => unlinked.validate(codeAt(authenticator, NOW)),
      RuntimeException,
      /Did you forget to call `.link\(tokenable\)\?`/
    )

    const row = await db.from('totp_authenticators').first()
    assert.isNull(row.verified_at)
    assert.equal(row.failed_verification_count, 0)
  })
})

test.group('TOTP authenticator | lock', () => {
  test('lock the authenticator once the failed verifications reach the maximum', async ({
    assert,
  }) => {
    freezeTime(NOW)
    const { db, authenticator } = await enroll()

    const error = await lock(authenticator, NOW)
    assert.equal(error.status, 429)
    assert.equal(error.retryAfter, 900)
    assert.equal(error.lockedUntil.toMillis(), after(NOW, 900).getTime())

    assert.isTrue(authenticator.isLocked())
    assert.equal(authenticator.lockedUntil!.toMillis(), after(NOW, 900).getTime())

    const row = await db.from('totp_authenticators').first()
    assert.isNotNull(row.locked_until)
    assert.equal(row.failed_verification_count, 0)
    assert.isNull(row.verified_at)
  })

  test('refuse even a right code while locked', async ({ assert }) => {
    freezeTime(NOW)
    const { db, authenticator } = await enroll()
    await lock(authenticator, NOW)

    freezeTime(after(NOW, 60))
    const error = await rejection<TOTPLockedException>(() =>
      authenticator.validate(codeAt(authenticator, after(NOW, 60)))
    )
    assert.instanceOf(error, E_TOTP_LOCKED)
    assert.equal(error.retryAfter, 840)

    const row = await db.from('totp_authenticators').first()
    assert.isNull(row.verified_at)
    assert.equal(row.failed_verification_count, 0)
  })

  test('refuse a backup code while locked', async ({ assert }) => {
    freezeTime(NOW)
    const { authenticator } = await enroll()
    const [code] = authenticator.getBackupCodes().release()
    await lock(authenticator, NOW)

    await assert.rejects(() => authenticator.verifyBackupCode(code), E_TOTP_LOCKED)
    assert.lengthOf(authenticator.getBackupCodes().release(), 10)
  })

  test('lift the lock by time alone', async ({ assert }) => {
    freezeTime(NOW)
    const { db, authenticator } = await enroll()
    await lock(authenticator, NOW)

    freezeTime(after(NOW, 899))
    assert.isTrue(authenticator.isLocked())

    const later = after(NOW, 901)
    freezeTime(later)
    assert.isFalse(authenticator.isLocked())
    assert.isTrue(await authenticator.validate(codeAt(authenticator, later)))

    const row = await db.from('totp_authenticators').first()
    assert.isNull(row.locked_until)
    assert.isNotNull(row.verified_at)
  })

  test('hand a fresh window of attempts once the lock is lifted', async ({ assert }) => {
    freezeTime(NOW)
    const { authenticator } = await enroll()
    await lock(authenticator, NOW)

    const later = after(NOW, 901)
    freezeTime(later)

    const error = await lock(authenticator, later)
    assert.equal(error.lockedUntil.toMillis(), after(later, 900).getTime())
  })

  test('resolve the lock policy from the tokenable options', async ({ assert }) => {
    freezeTime(NOW)
    const { authenticator } = await enroll({ maximumFailedVerifications: 2, lockDuration: '1h' })

    const error = await lock(authenticator, NOW, 2)
    assert.equal(error.retryAfter, 3600)
  })

  test('give precedence to the lock policy of the validation options', async ({ assert }) => {
    freezeTime(NOW)
    const { authenticator } = await enroll({ maximumFailedVerifications: 5, lockDuration: '1h' })

    const error = await rejection<TOTPLockedException>(() =>
      authenticator.validate(wrongCodeAt(authenticator, NOW), {
        maximumFailedVerifications: 1,
        lockDuration: 60,
      })
    )
    assert.instanceOf(error, E_TOTP_LOCKED)
    assert.equal(error.retryAfter, 60)
  })

  test('never lock the authenticator without a maximum', async ({ assert }) => {
    freezeTime(NOW)
    const { db, authenticator } = await enroll({ maximumFailedVerifications: 0 })
    const wrong = wrongCodeAt(authenticator, NOW)

    for (let attempt = 0; attempt < 10; attempt++) {
      await assert.rejects(() => authenticator.validate(wrong), E_INVALID_TOTP)
    }

    assert.isFalse(authenticator.isLocked())
    assert.equal((await db.from('totp_authenticators').first()).failed_verification_count, 10)
    assert.isTrue(await authenticator.validate(codeAt(authenticator, NOW)))
  })

  test('count the failed backup code verifications along with the failed codes', async ({
    assert,
  }) => {
    freezeTime(NOW)
    const { authenticator } = await enroll()
    const wrong = wrongCodeAt(authenticator, NOW)

    for (let attempt = 0; attempt < 4; attempt++) {
      await assert.rejects(() => authenticator.validate(wrong), E_INVALID_TOTP)
    }

    await assert.rejects(() => authenticator.verifyBackupCode(UNKNOWN_BACKUP_CODE), E_TOTP_LOCKED)
    assert.isTrue(authenticator.isLocked())
  })
})

test.group('TOTP authenticator | backup codes', () => {
  test('consume a backup code', async ({ assert }) => {
    const { db, manager, authenticator } = await enroll()
    const codes = authenticator.getBackupCodes().release()

    await authenticator.verifyBackupCode(codes[0])

    const remaining = authenticator.getBackupCodes().release()
    assert.lengthOf(remaining, 9)
    assert.notInclude(remaining, codes[0])
    assert.deepEqual(remaining, codes.slice(1))

    const row = await db.from('totp_authenticators').first()
    assert.deepEqual(manager.decryptBackupCodes(row.backup_codes), remaining)

    await assert.rejects(() => authenticator.verifyBackupCode(codes[0]), E_INVALID_BACKUP_CODE)
  })

  test('accept a code regardless of its case and separators', async ({ assert }) => {
    const { authenticator } = await enroll()
    const codes = authenticator.getBackupCodes().release()

    await authenticator.verifyBackupCode(` ${codes[0].toLowerCase().replace('-', ' ')} `)
    await authenticator.verifyBackupCode(codes[1].replace('-', ''))
    await authenticator.verifyBackupCode(new Secret(codes[2]))

    assert.deepEqual(authenticator.getBackupCodes().release(), codes.slice(3))
  })

  test('refuse an unknown code and record the failure', async ({ assert }) => {
    const { db, authenticator } = await enroll()

    await assert.rejects(
      () => authenticator.verifyBackupCode(UNKNOWN_BACKUP_CODE),
      E_INVALID_BACKUP_CODE
    )

    assert.equal(authenticator.failedVerificationCount, 1)
    assert.lengthOf(authenticator.getBackupCodes().release(), 10)
    assert.equal((await db.from('totp_authenticators').first()).failed_verification_count, 1)
  })

  test('clear the failures recorded so far with a right code', async ({ assert }) => {
    freezeTime(NOW)
    const { db, authenticator } = await enroll()
    const wrong = wrongCodeAt(authenticator, NOW)

    await assert.rejects(() => authenticator.validate(wrong), E_INVALID_TOTP)
    await assert.rejects(() => authenticator.validate(wrong), E_INVALID_TOTP)
    assert.equal((await db.from('totp_authenticators').first()).failed_verification_count, 2)

    await authenticator.verifyBackupCode(authenticator.getBackupCodes().release()[0])

    assert.equal(authenticator.failedVerificationCount, 0)
    assert.equal((await db.from('totp_authenticators').first()).failed_verification_count, 0)
  })

  test('leave the enrollment unconfirmed', async ({ assert }) => {
    const { db, user, authenticator } = await enroll()

    await authenticator.verifyBackupCode(authenticator.getBackupCodes().release()[0])

    assert.isNull(authenticator.verifiedAt)
    assert.isNull((await db.from('totp_authenticators').first()).verified_at)
    assert.isNull(await user.retrieveAuthenticator())
  })

  test('refuse an authenticator left unlinked before spending anything', async ({ assert }) => {
    const { db, authenticator } = await enroll()
    const unlinked = await TOTPAuthenticator.findOrFail(authenticator.id)
    const [code] = authenticator.getBackupCodes().release()

    await assert.rejects(() => unlinked.verifyBackupCode(code), RuntimeException)

    const row = await db.from('totp_authenticators').first()
    assert.equal(row.failed_verification_count, 0)
    assert.lengthOf(authenticator.getBackupCodes().release(), 10)
  })

  test('never spend the same code through two instances of the authenticator', async ({
    assert,
  }) => {
    const { db, manager, user, authenticator } = await enroll()
    const other = (await TOTPAuthenticator.findOrFail(authenticator.id)).link(user)
    const [code] = authenticator.getBackupCodes().release()

    await authenticator.verifyBackupCode(code)
    await assert.rejects(() => other.verifyBackupCode(code), E_INVALID_BACKUP_CODE)

    const row = await db.from('totp_authenticators').first()
    assert.lengthOf(manager.decryptBackupCodes(row.backup_codes), 9)
  })

  test('regenerate the backup codes', async ({ assert }) => {
    const { db, manager, authenticator } = await enroll()
    const previous = authenticator.getBackupCodes().release()

    const fresh = await authenticator.regenerateBackupCodes()
    assert.instanceOf(fresh, Secret)
    assert.lengthOf(fresh.release(), 10)
    assert.deepEqual(authenticator.getBackupCodes().release(), fresh.release())
    for (const code of fresh.release()) {
      assert.notInclude(previous, code)
    }

    const row = await db.from('totp_authenticators').first()
    assert.deepEqual(manager.decryptBackupCodes(row.backup_codes), fresh.release())

    await assert.rejects(() => authenticator.verifyBackupCode(previous[0]), E_INVALID_BACKUP_CODE)
    await authenticator.verifyBackupCode(fresh.release()[0])
  })

  test('size the regenerated codes from the tokenable options', async ({ assert }) => {
    const { authenticator } = await enroll({ backupCodesCount: 4, backupCodesLength: 8 })

    const codes = (await authenticator.regenerateBackupCodes()).release()
    assert.lengthOf(codes, 4)
    for (const code of codes) {
      assert.lengthOf(code.replace('-', ''), 8)
    }
  })

  test('give precedence to the options of the regeneration', async ({ assert }) => {
    const { authenticator } = await enroll({ backupCodesCount: 4, backupCodesLength: 8 })

    const codes = (
      await authenticator.regenerateBackupCodes({ backupCodesCount: 2, backupCodesLength: 12 })
    ).release()
    assert.lengthOf(codes, 2)
    for (const code of codes) {
      assert.lengthOf(code.replace('-', ''), 12)
    }
  })
})

test.group('TOTP authenticator | uri', () => {
  test('expose the enrollment as an otpauth uri', async ({ assert }) => {
    freezeTime(NOW)
    const { authenticator } = await enroll()

    assert.match(authenticator.uri, /^otpauth:\/\/totp\//)

    const parsed = URI.parse(authenticator.uri) as TOTP
    assert.instanceOf(parsed, TOTP)
    assert.equal(parsed.issuer, 'FriendsOfAdonis')
    assert.equal(parsed.label, 'virk@adonisjs.com')
    assert.equal(parsed.secret.base32, authenticator.getSecret().release())
    assert.equal(parsed.algorithm, 'SHA1')
    assert.equal(parsed.digits, 6)
    assert.equal(parsed.period, 30)

    assert.isTrue(await authenticator.validate(parsed.generate()))
  })

  test('describe the shape of the codes from the tokenable options', async ({ assert }) => {
    freezeTime(NOW)
    const { authenticator } = await enroll(
      { issuer: 'Acme', digits: 8, period: 60 },
      { algorithm: 'SHA256' }
    )

    const parsed = URI.parse(authenticator.uri) as TOTP
    assert.equal(parsed.issuer, 'Acme')
    assert.equal(parsed.algorithm, 'SHA256')
    assert.equal(parsed.digits, 8)
    assert.equal(parsed.period, 60)
    assert.isTrue(await authenticator.validate(parsed.generate()))
  })

  test('render the uri as a QR code', async ({ assert }) => {
    const { authenticator } = await enroll()

    assert.match(await authenticator.generateQRCode(), /^data:image\/png;base64,/)
  })

  test('refuse to describe an authenticator left unlinked', async ({ assert }) => {
    const { authenticator } = await enroll()
    const unlinked = await TOTPAuthenticator.findOrFail(authenticator.id)

    assert.throws(() => unlinked.uri, RuntimeException)
    assert.throws(() => unlinked.tokenable, RuntimeException)
  })
})
