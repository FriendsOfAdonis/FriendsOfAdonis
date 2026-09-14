import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import { E_INVALID_BACKUP_CODE, E_INVALID_TOTP, E_TOTP_LOCKED } from '../../modules/totp/errors.ts'
import * as errors from '../../src/errors.ts'
import { freezeTime } from '../helpers.ts'

test.group('TOTP errors', () => {
  test('describe an invalid code as an unauthorized request', ({ assert }) => {
    const error = new E_INVALID_TOTP()

    assert.equal(error.status, 401)
    assert.equal(error.code, 'E_INVALID_TOTP')
    assert.equal(error.message, 'The provided authenticator code is invalid.')
  })

  test('describe an invalid backup code as an unauthorized request', ({ assert }) => {
    const error = new E_INVALID_BACKUP_CODE()

    assert.equal(error.status, 401)
    assert.equal(error.code, 'E_INVALID_BACKUP_CODE')
    assert.equal(error.message, 'The provided backup code is invalid.')
  })

  test('describe a locked authenticator as too many requests', ({ assert }) => {
    const lockedUntil = DateTime.now().plus({ minutes: 15 })
    const error = new E_TOTP_LOCKED(lockedUntil)

    assert.equal(error.status, 429)
    assert.equal(error.code, 'E_TOTP_LOCKED')
    assert.equal(error.message, 'Too many failed verifications, the authenticator is locked.')
    assert.strictEqual(error.lockedUntil, lockedUntil)
  })

  test('compute the seconds left before the lock is lifted', ({ assert }) => {
    freezeTime(new Date('2026-01-01T10:00:00.000Z'))

    const error = new E_TOTP_LOCKED(DateTime.now().plus({ minutes: 15 }))
    assert.equal(error.retryAfter, 900)
  })

  test('round the seconds left up, never handing a zero for a lock still held', ({ assert }) => {
    freezeTime(new Date('2026-01-01T10:00:00.000Z'))

    const error = new E_TOTP_LOCKED(DateTime.now().plus({ milliseconds: 400 }))
    assert.equal(error.retryAfter, 1)
  })

  test('never hand a negative retry delay for a lock already lifted', ({ assert }) => {
    freezeTime(new Date('2026-01-01T10:00:00.000Z'))

    const error = new E_TOTP_LOCKED(DateTime.now().minus({ minutes: 1 }))
    assert.equal(error.retryAfter, 0)
  })

  test('expose the errors from the errors entrypoint', ({ assert }) => {
    assert.strictEqual(errors.E_INVALID_TOTP, E_INVALID_TOTP)
    assert.strictEqual(errors.E_INVALID_BACKUP_CODE, E_INVALID_BACKUP_CODE)
    assert.strictEqual(errors.E_TOTP_LOCKED, E_TOTP_LOCKED)
  })
})
