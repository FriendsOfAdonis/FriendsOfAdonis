import { configProvider } from '@adonisjs/core'
import { RuntimeException } from '@adonisjs/core/exceptions'
import type { ConfigProvider } from '@adonisjs/core/types'
import type { SentinelConfig, SentinelOptions } from './types.ts'
import { LucidTokenProvider, LucidTokenProviderOptions } from '../modules/token/providers/lucid.ts'

/**
 * Define config for the sentinel package. The token provider is
 * resolved lazily, when the service provider first needs it.
 *
 * @param config - Configuration object with the token provider and the
 * options of each module
 *
 * @example
 * ```ts
 * const sentinelConfig = defineConfig({
 *   tokens: tokens.lucid(),
 *   totp: { issuer: 'My app' },
 *   magicLink: { url: (token) => `https://example.com/login/magic?token=${token}` },
 * })
 * ```
 */
export function defineConfig(config: SentinelConfig): ConfigProvider<SentinelOptions> {
  return configProvider.create(async (app) => {
    /**
     * The token provider should always be provided
     */
    if (!config.tokens) {
      throw new RuntimeException(
        'Missing "tokens" inside "config/sentinel.ts". Use "tokens.lucid()" to define the token provider'
      )
    }

    return {
      tokens: await config.tokens.resolver(app),
      magicLink: config.magicLink,
      otp: config.otp,
      totp: config.totp,
      password: config.password,
      email: config.email,
    }
  })
}

/**
 * Helpers to configure the token provider inside the config file. The
 * provider is constructed when the sentinel config is first resolved.
 *
 * @example
 * ```ts
 * const sentinelConfig = defineConfig({
 *   tokens: tokens.lucid({ table: 'sentinel_tokens' }),
 * })
 * ```
 */
export const tokens = {
  lucid: (config: LucidTokenProviderOptions = {}) => {
    return configProvider.create(async (app) => {
      const db = await app.container.make('lucid.db')
      return new LucidTokenProvider(db, config)
    })
  },
}
