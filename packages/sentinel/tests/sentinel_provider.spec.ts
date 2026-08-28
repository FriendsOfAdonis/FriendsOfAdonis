import { configProvider } from '@adonisjs/core'
import { test } from '@japa/runner'
import { MagicLinkManager } from '../modules/magic_link/manager.ts'
import { PasswordManager } from '../modules/password/manager.ts'
import { TokenManager } from '../modules/token/manager.ts'
import { defineConfig } from '../src/define_config.ts'
import { Sentinel } from '../src/sentinel.ts'
import type { SentinelConfig } from '../src/types.ts'
import { createApp, MemoryTokenProvider } from './helpers.ts'

const providers = [() => import('../providers/sentinel_provider.ts')]

function sentinelConfig(config: Omit<SentinelConfig, 'tokens'> = {}) {
  return defineConfig({
    tokens: configProvider.create(async () => new MemoryTokenProvider()),
    ...config,
  })
}

test.group('Sentinel provider', () => {
  test('should register the sentinel service inside the container', async ({ assert }) => {
    const app = await createApp({ providers, config: { sentinel: sentinelConfig() } })

    const sentinel = await app.container.make('sentinel')

    assert.instanceOf(sentinel, Sentinel)
  })

  test('should resolve the same instance by class and by alias', async ({ assert }) => {
    const app = await createApp({ providers, config: { sentinel: sentinelConfig() } })

    assert.strictEqual(await app.container.make(Sentinel), await app.container.make('sentinel'))
  })

  test('should expose the token manager', async ({ assert }) => {
    const app = await createApp({ providers, config: { sentinel: sentinelConfig() } })

    const sentinel = await app.container.make('sentinel')

    assert.instanceOf(sentinel.tokens, TokenManager)
  })

  test('should expose the magic link, OTP and password managers when configured', async ({
    assert,
  }) => {
    const app = await createApp({
      providers,
      config: {
        sentinel: sentinelConfig({
          magicLink: { url: 'https://example.com/magic-link', expiresIn: '10m' },
          otp: { length: 6, expiresIn: '5m', maximumFailedAttempts: 5 },
          password: { expiresIn: '1h' },
        }),
      },
    })

    const sentinel = await app.container.make('sentinel')

    assert.instanceOf(sentinel.magicLink, MagicLinkManager)
    assert.instanceOf(sentinel.password, PasswordManager)
  })

  test('should throw when a building block is not configured', async ({ assert }) => {
    const app = await createApp({ providers, config: { sentinel: sentinelConfig() } })

    const sentinel = await app.container.make('sentinel')

    assert.throws(
      () => sentinel.magicLink,
      'MagicLink is not configured. Make sure you have configured `config/sentinel.ts`.'
    )
    assert.throws(
      () => sentinel.password,
      'Password is not configured. Make sure you have configured `config/sentinel.ts`.'
    )
  })

  test('should throw when the config does not use defineConfig', async ({ assert }) => {
    const app = await createApp({ providers, config: { sentinel: {} } })

    await assert.rejects(
      () => app.container.make('sentinel'),
      'Invalid "config/sentinel.ts" file. Make sure you are using the "defineConfig" method'
    )
  })

  test('should throw when the tokens provider is missing', async ({ assert }) => {
    const app = await createApp({ providers, config: { sentinel: defineConfig({} as any) } })

    await assert.rejects(
      () => app.container.make('sentinel'),
      'Missing "tokens" inside "config/sentinel.ts". Use "tokens.lucid()" to define the token provider'
    )
  })
})
