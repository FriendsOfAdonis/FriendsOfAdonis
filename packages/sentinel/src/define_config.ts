import { configProvider } from '@adonisjs/core'
import { RuntimeException } from '@adonisjs/core/exceptions'
import type { ConfigProvider } from '@adonisjs/core/types'
import type { SentinelConfig, SentinelOptions } from './types.ts'
import { LucidTokenProvider, LucidTokenProviderOptions } from '../modules/token/providers/lucid.ts'

/**
 * Creates the Sentinel configuration. The returned config provider is
 * resolved lazily by the provider when the service is first resolved.
 */
export function defineConfig(config: SentinelConfig): ConfigProvider<SentinelOptions> {
  return configProvider.create(async (app) => {
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
    }
  })
}

export const tokens = {
  lucid: (config: LucidTokenProviderOptions = {}) => {
    return configProvider.create(async (app) => {
      const db = await app.container.make('lucid.db')
      return new LucidTokenProvider(db, config)
    })
  },
}
