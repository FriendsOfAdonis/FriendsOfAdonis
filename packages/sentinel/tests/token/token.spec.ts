import { test } from '@japa/runner'
import { SentinelToken, type SentinelTokenAttributes } from '../../modules/token/token.ts'

function createToken(overrides: Partial<SentinelTokenAttributes> = {}) {
  return new SentinelToken({
    id: 1,
    tokenableId: 1,
    kind: 'magic_link',
    name: null,
    purpose: null,
    hash: 'hash',
    usageCount: 0,
    maximumUsageCount: 1,
    failedAttemptsCount: 0,
    maximumFailedAttemptsCount: null,
    metadata: null,
    expiresAt: new Date(Date.now() + 60_000),
    lastUsedAt: null,
    createdAt: new Date(),
    ...overrides,
  })
}

test.group('SentinelToken', () => {
  test('should expose the given attributes', ({ assert }) => {
    const attributes: SentinelTokenAttributes = {
      id: 42,
      tokenableId: 'user-1',
      kind: 'magic_link',
      name: 'login',
      purpose: 'signin',
      hash: 'hash',
      usageCount: 1,
      maximumUsageCount: 3,
      failedAttemptsCount: 2,
      maximumFailedAttemptsCount: 5,
      metadata: { ip: '127.0.0.1' },
      expiresAt: new Date('2030-01-01T00:00:00Z'),
      lastUsedAt: new Date('2029-01-01T00:00:00Z'),
      createdAt: new Date('2028-01-01T00:00:00Z'),
    }

    const token = new SentinelToken(attributes)

    assert.deepEqual({ ...token }, attributes)
  })

  test('should not be expired before its expiration date', ({ assert }) => {
    assert.isFalse(createToken({ expiresAt: new Date(Date.now() + 60_000) }).isExpired())
  })

  test('should be expired once its expiration date has passed', ({ assert }) => {
    assert.isTrue(createToken({ expiresAt: new Date(Date.now() - 1_000) }).isExpired())
  })

  test('should not be exhausted while usages remain', ({ assert }) => {
    assert.isFalse(createToken({ usageCount: 0, maximumUsageCount: 1 }).isExhausted())
    assert.isFalse(createToken({ usageCount: 2, maximumUsageCount: 3 }).isExhausted())
  })

  test('should be exhausted once the maximum usage count is reached', ({ assert }) => {
    assert.isTrue(createToken({ usageCount: 1, maximumUsageCount: 1 }).isExhausted())
    assert.isTrue(createToken({ usageCount: 3, maximumUsageCount: 3 }).isExhausted())
    assert.isTrue(createToken({ usageCount: 4, maximumUsageCount: 3 }).isExhausted())
  })

  test('should not be locked while failed attempts remain', ({ assert }) => {
    assert.isFalse(
      createToken({ failedAttemptsCount: 0, maximumFailedAttemptsCount: 1 }).isLocked()
    )
    assert.isFalse(
      createToken({ failedAttemptsCount: 2, maximumFailedAttemptsCount: 3 }).isLocked()
    )
  })

  test('should be locked once the maximum failed attempts count is reached', ({ assert }) => {
    assert.isTrue(createToken({ failedAttemptsCount: 1, maximumFailedAttemptsCount: 1 }).isLocked())
    assert.isTrue(createToken({ failedAttemptsCount: 3, maximumFailedAttemptsCount: 3 }).isLocked())
    assert.isTrue(createToken({ failedAttemptsCount: 4, maximumFailedAttemptsCount: 3 }).isLocked())
  })

  test('should never be locked without a maximum failed attempts count', ({ assert }) => {
    assert.isFalse(
      createToken({ failedAttemptsCount: 0, maximumFailedAttemptsCount: null }).isLocked()
    )
    assert.isFalse(
      createToken({ failedAttemptsCount: 100, maximumFailedAttemptsCount: null }).isLocked()
    )
  })
})
