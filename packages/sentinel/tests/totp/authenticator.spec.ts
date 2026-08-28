import { compose } from '@adonisjs/core/helpers'
import type { ApplicationService } from '@adonisjs/core/types'
import type { Database } from '@adonisjs/lucid/database'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import { E_INVALID_BACKUP_CODE, E_TOTP_LOCKED } from '../../modules/totp/errors.ts'
import type { withTOTP as WithTOTP } from '../../modules/totp/mixins/with_totp.ts'
import type { TOTPAuthenticator as TOTPAuthenticatorModel } from '../../modules/totp/models/totp_authenticator.ts'
import { createAuthenticatorsTable, createSentinelApp } from '../helpers.ts'

/**
 * Model using the mixin, locked for ten minutes after three consecutive
 * failed verifications. The mixin is handed over rather than imported
 * because its module resolves the sentinel service from the application
 * booted at import time, see "createSentinelApp".
 */
function defineUser(withTOTP: typeof WithTOTP) {
  class User extends compose(
    BaseModel,
    withTOTP({ issuer: 'Sentinel', maximumFailedVerifications: 3, lockDuration: '10m' })
  ) {
    static table = 'users'

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare email: string
  }

  return User
}

/**
 * A code the authenticator generated one period ago, which its
 * validation window still covers.
 */
function previousCode(authenticator: TOTPAuthenticatorModel) {
  const totp = authenticator.$totp
  return totp.generate({ timestamp: Date.now() - totp.period * 1000 })
}

/**
 * A code the authenticator will generate one period from now, which its
 * validation window already covers and whose step is still free.
 */
function nextCode(authenticator: TOTPAuthenticatorModel) {
  const totp = authenticator.$totp
  return totp.generate({ timestamp: Date.now() + totp.period * 1000 })
}

/**
 * A code of the same length differing from the given one.
 */
function wrongCode(code: string) {
  return code.slice(0, -1) + ((Number(code.at(-1)) + 1) % 10)
}

/**
 * A backup code of the same shape differing from the given one.
 */
function wrongBackupCode(code: string) {
  return `${code.slice(0, -1)}${code.at(-1) === 'Z' ? 'Y' : 'Z'}`
}

/**
 * Awaits a rejection with an "E_TOTP_LOCKED" error and returns it.
 */
async function lockedError(promise: Promise<unknown>) {
  try {
    await promise
  } catch (error) {
    if (error instanceof E_TOTP_LOCKED) return error
    throw error
  }

  throw new Error('Expected the authenticator to be locked')
}

test.group('TOTPAuthenticator', (group) => {
  let app: ApplicationService
  let db: Database
  let User: ReturnType<typeof defineUser>
  let TOTPAuthenticator: typeof TOTPAuthenticatorModel

  group.setup(async () => {
    const sentinel = await createSentinelApp()
    app = sentinel.app
    db = sentinel.db
    await createAuthenticatorsTable(db)

    const { withTOTP } = await import('../../modules/totp/mixins/with_totp.ts')
    ;({ TOTPAuthenticator } = await import('../../modules/totp/models/totp_authenticator.ts'))
    User = defineUser(withTOTP)
  })

  group.each.teardown(async () => {
    await TOTPAuthenticator.query().delete()
    await User.query().delete()
  })

  group.teardown(() => app.terminate())

  /**
   * Creates a user along with its authenticator.
   */
  async function createAuthenticator() {
    const user = await User.create({ email: `jane+${Date.now()}@example.com` })
    return user.createAuthenticator()
  }

  /**
   * Reads the persisted state of an authenticator.
   */
  async function reload(authenticator: TOTPAuthenticatorModel) {
    return TOTPAuthenticator.findOrFail(authenticator.id)
  }

  test('should create an authenticator without failure', async ({ assert }) => {
    const authenticator = await createAuthenticator()

    assert.equal(authenticator.failedVerificationCount, 0)
    assert.isNull(authenticator.lockedUntil)
    assert.isFalse(authenticator.isLocked())

    const row = await reload(authenticator)
    assert.equal(row.failedVerificationCount, 0)
    assert.isNull(row.lockedUntil)
  })

  test('should count a wrong code as a failed verification', async ({ assert }) => {
    const authenticator = await createAuthenticator()
    const wrong = wrongCode(authenticator.$totp.generate())

    assert.isFalse(await authenticator.validate(wrong))
    assert.isFalse(await authenticator.validate(wrong))

    assert.equal(authenticator.failedVerificationCount, 2)
    assert.isFalse(authenticator.isLocked())

    const row = await reload(authenticator)
    assert.equal(row.failedVerificationCount, 2)
    assert.isNull(row.lockedUntil)
  })

  test('should lock the authenticator once the maximum is reached', async ({ assert }) => {
    const authenticator = await createAuthenticator()
    const wrong = wrongCode(authenticator.$totp.generate())

    await authenticator.validate(wrong)
    await authenticator.validate(wrong)

    const error = await lockedError(authenticator.validate(wrong))

    assert.equal(error.message, 'Too many failed verifications, the authenticator is locked.')
    assert.approximately(error.retryAfter, 10 * 60, 5)
    assert.isTrue(authenticator.isLocked())

    /**
     * The count restarts along with the lock, the authenticator is given
     * a fresh window of attempts once it is lifted.
     */
    assert.equal(authenticator.failedVerificationCount, 0)

    const row = await reload(authenticator)
    assert.equal(row.failedVerificationCount, 0)
    assert.isTrue(row.isLocked())
  })

  test('should refuse a right code while the authenticator is locked', async ({ assert }) => {
    const authenticator = await createAuthenticator()
    const wrong = wrongCode(authenticator.$totp.generate())

    await authenticator.validate(wrong)
    await authenticator.validate(wrong)
    await lockedError(authenticator.validate(wrong))

    const error = await lockedError(authenticator.validate(authenticator.$totp.generate()))

    assert.instanceOf(error, E_TOTP_LOCKED)
    assert.isNull(authenticator.verifiedAt)
  })

  test('should accept a code again once the lock is lifted', async ({ assert }) => {
    const authenticator = await createAuthenticator()

    authenticator.lockedUntil = DateTime.now().minus({ minutes: 1 })
    await authenticator.save()

    assert.isTrue(await authenticator.validate(authenticator.$totp.generate()))
    assert.isNull(authenticator.lockedUntil)
    assert.isNotNull(authenticator.verifiedAt)

    const row = await reload(authenticator)
    assert.isNull(row.lockedUntil)
  })

  test('should clear the failures recorded on a right code', async ({ assert }) => {
    const authenticator = await createAuthenticator()

    assert.isFalse(await authenticator.validate(wrongCode(authenticator.$totp.generate())))
    assert.equal(authenticator.failedVerificationCount, 1)

    assert.isTrue(await authenticator.validate(authenticator.$totp.generate()))
    assert.equal(authenticator.failedVerificationCount, 0)

    const row = await reload(authenticator)
    assert.equal(row.failedVerificationCount, 0)
  })

  test('should record the step a right code was generated for', async ({ assert }) => {
    const authenticator = await createAuthenticator()
    assert.isNull(authenticator.lastUsedCounter)

    assert.isTrue(await authenticator.validate(authenticator.$totp.generate()))

    const counter = authenticator.$totp.counter()
    assert.equal(authenticator.lastUsedCounter, counter)
    assert.equal((await reload(authenticator)).lastUsedCounter, counter)
  })

  test('should refuse a code handed a second time', async ({ assert }) => {
    const authenticator = await createAuthenticator()
    const code = authenticator.$totp.generate()

    assert.isTrue(await authenticator.validate(code))
    assert.isFalse(await authenticator.validate(code))

    /**
     * A replayed code is an attempt like any other, it counts towards
     * the lock.
     */
    assert.equal(authenticator.failedVerificationCount, 1)
    assert.equal((await reload(authenticator)).failedVerificationCount, 1)
  })

  test('should refuse a code from a step already used', async ({ assert }) => {
    const authenticator = await createAuthenticator()

    assert.isTrue(await authenticator.validate(authenticator.$totp.generate()))

    const previous = previousCode(authenticator)

    /**
     * The window still covers the code, the step already consumed is
     * what refuses it.
     */
    assert.isNotNull(authenticator.$totp.validate({ token: previous, window: 1 }))
    assert.isFalse(await authenticator.validate(previous))
  })

  test('should accept a code from a step after the last one used', async ({ assert }) => {
    const authenticator = await createAuthenticator()

    authenticator.lastUsedCounter = authenticator.$totp.counter() - 1
    await authenticator.save()

    assert.isTrue(await authenticator.validate(authenticator.$totp.generate()))
    assert.equal(authenticator.lastUsedCounter, authenticator.$totp.counter())
  })

  test('should let a single validation consume a code', async ({ assert }) => {
    const authenticator = await createAuthenticator()
    const code = authenticator.$totp.generate()
    const user = authenticator.tokenable

    const [first, second] = await Promise.all([reload(authenticator), reload(authenticator)])
    const outcomes = await Promise.all([
      first.link(user).validate(code),
      second.link(user).validate(code),
    ])

    assert.lengthOf(outcomes.filter(Boolean), 1)
    assert.equal((await reload(authenticator)).failedVerificationCount, 1)
  })

  test('should apply the maximum and the duration given to validate', async ({ assert }) => {
    const authenticator = await createAuthenticator()
    const wrong = wrongCode(authenticator.$totp.generate())

    const error = await lockedError(
      authenticator.validate(wrong, { maximumFailedVerifications: 1, lockDuration: '30s' })
    )

    assert.approximately(error.retryAfter, 30, 5)
  })

  test('should never lock without a maximum', async ({ assert }) => {
    const authenticator = await createAuthenticator()
    const wrong = wrongCode(authenticator.$totp.generate())

    for (let attempt = 0; attempt < 4; attempt++) {
      assert.isFalse(await authenticator.validate(wrong, { maximumFailedVerifications: 0 }))
    }

    assert.equal(authenticator.failedVerificationCount, 4)
    assert.isFalse(authenticator.isLocked())
  })

  /**
   * Every authenticator enrolled by a user, newest first.
   */
  async function authenticatorsOf(user: InstanceType<typeof User>) {
    return TOTPAuthenticator.query().where('tokenable_id', user.id).orderBy('id', 'desc')
  }

  test('should hide an enrollment until a code confirms it', async ({ assert }) => {
    const user = await User.create({ email: `jane+${Date.now()}@example.com` })
    const authenticator = await user.createAuthenticator()

    assert.isNull(authenticator.verifiedAt)
    assert.isNull(await user.retrieveAuthenticator())

    const pending = await user.retrieveAuthenticator(true)
    assert.equal(pending!.id, authenticator.id)

    assert.isTrue(await authenticator.validate(authenticator.$totp.generate()))

    const retrieved = await user.retrieveAuthenticator()
    assert.equal(retrieved!.id, authenticator.id)
  })

  test('should replace an enrollment left unconfirmed', async ({ assert }) => {
    const user = await User.create({ email: `jane+${Date.now()}@example.com` })

    const abandoned = await user.createAuthenticator({ label: 'abandoned' })
    const pending = await user.createAuthenticator({ label: 'pending' })

    const rows = await authenticatorsOf(user)
    assert.lengthOf(rows, 1)
    assert.equal(rows[0].id, pending.id)
    assert.notEqual(pending.id, abandoned.id)
  })

  test('should keep the authenticator in use while a new one is enrolled', async ({ assert }) => {
    const user = await User.create({ email: `jane+${Date.now()}@example.com` })
    const current = await user.createAuthenticator({ label: 'current' })
    assert.isTrue(await current.validate(current.$totp.generate()))

    const enrolled = await user.createAuthenticator({ label: 'enrolled' })

    /**
     * The enrollment is not the one the user logs in with until it has
     * been confirmed, the authenticator in use answers meanwhile.
     */
    const retrieved = await user.retrieveAuthenticator()
    assert.equal(retrieved!.id, current.id)
    assert.lengthOf(await authenticatorsOf(user), 2)

    const pending = await user.retrieveAuthenticator(true)
    assert.equal(pending!.id, enrolled.id)
  })

  test('should retire the previous authenticator once the new one is confirmed', async ({
    assert,
  }) => {
    const user = await User.create({ email: `jane+${Date.now()}@example.com` })
    const current = await user.createAuthenticator({ label: 'current' })
    assert.isTrue(await current.validate(current.$totp.generate()))

    const enrolled = await user.createAuthenticator({ label: 'enrolled' })
    assert.isTrue(await enrolled.validate(enrolled.$totp.generate()))

    const rows = await authenticatorsOf(user)
    assert.lengthOf(rows, 1)
    assert.equal(rows[0].id, enrolled.id)

    const retrieved = await user.retrieveAuthenticator()
    assert.equal(retrieved!.id, enrolled.id)
    assert.equal(retrieved!.label, 'enrolled')
  })

  test('should accept the codes of a freshly enrolled authenticator', async ({ assert }) => {
    const user = await User.create({ email: `jane+${Date.now()}@example.com` })
    const current = await user.createAuthenticator({ label: 'current' })
    assert.isTrue(await current.validate(current.$totp.generate()))

    const enrolled = await user.createAuthenticator({ label: 'enrolled' })
    assert.isTrue(await enrolled.validate(enrolled.$totp.generate()))

    /**
     * The codes of the new device are the ones the user is typing from
     * now on, they have to be accepted by what the login flow retrieves.
     */
    const retrieved = await user.retrieveAuthenticator()
    assert.isTrue(await retrieved!.validate(nextCode(enrolled)))
  })

  test('should leave the authenticators of the other users alone', async ({ assert }) => {
    const user = await User.create({ email: `jane+${Date.now()}@example.com` })
    const other = await User.create({ email: `john+${Date.now()}@example.com` })

    const theirs = await other.createAuthenticator()
    assert.isTrue(await theirs.validate(theirs.$totp.generate()))

    const enrolled = await user.createAuthenticator()
    assert.isTrue(await enrolled.validate(enrolled.$totp.generate()))

    assert.lengthOf(await authenticatorsOf(other), 1)
    assert.equal((await other.retrieveAuthenticator())!.id, theirs.id)
  })

  test('should not retire the previous authenticator on a backup code', async ({ assert }) => {
    const user = await User.create({ email: `jane+${Date.now()}@example.com` })
    const current = await user.createAuthenticator({ label: 'current' })
    assert.isTrue(await current.validate(current.$totp.generate()))

    const enrolled = await user.createAuthenticator({ label: 'enrolled' })

    /**
     * The backup codes are handed over at enrollment time, spending one
     * proves nothing about the secret having been scanned.
     */
    await enrolled.verifyBackupCode(enrolled.getBackupCodes().release()[0])

    assert.isNull(enrolled.verifiedAt)
    assert.lengthOf(await authenticatorsOf(user), 2)
    assert.equal((await user.retrieveAuthenticator())!.id, current.id)
  })

  test('should count a wrong backup code as a failed verification', async ({ assert }) => {
    const authenticator = await createAuthenticator()
    const wrong = wrongBackupCode(authenticator.getBackupCodes().release()[0])

    await assert.rejects(() => authenticator.verifyBackupCode(wrong), E_INVALID_BACKUP_CODE.message)
    await assert.rejects(() => authenticator.verifyBackupCode(wrong), E_INVALID_BACKUP_CODE.message)

    assert.equal(authenticator.failedVerificationCount, 2)

    await lockedError(authenticator.verifyBackupCode(wrong))
    assert.isTrue(authenticator.isLocked())
  })

  test('should refuse a backup code while the authenticator is locked', async ({ assert }) => {
    const authenticator = await createAuthenticator()
    const codes = authenticator.getBackupCodes().release()

    authenticator.lockedUntil = DateTime.now().plus({ minutes: 10 })
    await authenticator.save()

    await lockedError(authenticator.verifyBackupCode(codes[0]))
    assert.lengthOf((await reload(authenticator)).getBackupCodes().release(), codes.length)
  })

  test('should clear the failures recorded on a right backup code', async ({ assert }) => {
    const authenticator = await createAuthenticator()
    const codes = authenticator.getBackupCodes().release()

    assert.isFalse(await authenticator.validate(wrongCode(authenticator.$totp.generate())))
    assert.equal(authenticator.failedVerificationCount, 1)

    await authenticator.verifyBackupCode(codes[0])

    assert.equal(authenticator.failedVerificationCount, 0)
    assert.isNull(authenticator.lockedUntil)

    const row = await reload(authenticator)
    assert.equal(row.failedVerificationCount, 0)
    assert.lengthOf(row.getBackupCodes().release(), codes.length - 1)
  })
})
