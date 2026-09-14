import { test } from '@japa/runner'
import { SentinelToken, type SentinelTokenAttributes } from '../../modules/token/token.ts'
import { freezeTime } from '../helpers.ts'

const NOW = new Date('2026-01-01T10:00:00.000Z')
const EXPIRES_AT = new Date('2026-01-01T10:20:00.000Z')

/**
 * Returns a single use token that never locks, created now and
 * expiring in 20 minutes, unless overridden
 */
function createToken(overrides: Partial<SentinelTokenAttributes> = {}) {
  return new SentinelToken({
    id: 1,
    tokenableId: 1,
    kind: 'otp',
    name: null,
    purpose: null,
    hash: 'hash',
    usageCount: 0,
    maximumUsageCount: 1,
    failedAttemptsCount: 0,
    maximumFailedAttemptsCount: null,
    metadata: null,
    expiresAt: EXPIRES_AT,
    lastUsedAt: null,
    createdAt: NOW,
    ...overrides,
  })
}

test.group('Sentinel token', () => {
  test('carry the attributes it was created with', ({ assert }) => {
    const attributes: SentinelTokenAttributes = {
      id: '6c9a0d5e-1f0b-4c1c-9d3a-2b7f0e5a8c11',
      tokenableId: 42n,
      kind: 'magic_link',
      name: 'Signin link',
      purpose: 'signin',
      hash: 'hash',
      usageCount: 1,
      maximumUsageCount: 3,
      failedAttemptsCount: 2,
      maximumFailedAttemptsCount: 5,
      metadata: { redirect: '/dashboard' },
      expiresAt: EXPIRES_AT,
      lastUsedAt: NOW,
      createdAt: NOW,
    }

    const token = new SentinelToken(attributes)

    assert.deepEqual({ ...token }, attributes)
  })
})

test.group('Sentinel token | isExpired', () => {
  test('consider the token valid before it expires', ({ assert }) => {
    freezeTime(NOW)
    assert.isFalse(createToken().isExpired())
  })

  test('consider the token valid at the very moment it expires', ({ assert }) => {
    freezeTime(EXPIRES_AT)
    assert.isFalse(createToken().isExpired())
  })

  test('consider the token expired once past its expiry', ({ assert }) => {
    freezeTime(new Date(EXPIRES_AT.getTime() + 1))
    assert.isTrue(createToken().isExpired())
  })
})

test.group('Sentinel token | isExhausted', () => {
  test('consider a token used {usageCount} times out of {maximumUsageCount} {outcome}')
    .with([
      { usageCount: 0, maximumUsageCount: 1, outcome: 'usable', exhausted: false },
      { usageCount: 1, maximumUsageCount: 1, outcome: 'exhausted', exhausted: true },
      { usageCount: 2, maximumUsageCount: 3, outcome: 'usable', exhausted: false },
      { usageCount: 3, maximumUsageCount: 3, outcome: 'exhausted', exhausted: true },
      { usageCount: 4, maximumUsageCount: 3, outcome: 'exhausted', exhausted: true },
    ])
    .run(({ assert }, { usageCount, maximumUsageCount, exhausted }) => {
      assert.equal(createToken({ usageCount, maximumUsageCount }).isExhausted(), exhausted)
    })
})

test.group('Sentinel token | isLocked', () => {
  test('never lock a token without failed attempts budget', ({ assert }) => {
    const token = createToken({ failedAttemptsCount: 1000, maximumFailedAttemptsCount: null })

    assert.isFalse(token.isLocked())
  })

  test(
    'consider a token with {failedAttemptsCount} failed attempts out of {maximumFailedAttemptsCount} {outcome}'
  )
    .with([
      { failedAttemptsCount: 0, maximumFailedAttemptsCount: 3, outcome: 'usable', locked: false },
      { failedAttemptsCount: 2, maximumFailedAttemptsCount: 3, outcome: 'usable', locked: false },
      { failedAttemptsCount: 3, maximumFailedAttemptsCount: 3, outcome: 'locked', locked: true },
      { failedAttemptsCount: 4, maximumFailedAttemptsCount: 3, outcome: 'locked', locked: true },
    ])
    .run(({ assert }, { failedAttemptsCount, maximumFailedAttemptsCount, locked }) => {
      const token = createToken({ failedAttemptsCount, maximumFailedAttemptsCount })

      assert.equal(token.isLocked(), locked)
    })
})
