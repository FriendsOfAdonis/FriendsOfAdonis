import app from '@adonisjs/core/services/app'
import { ShopkeeperConfig } from './types.js'
import { InvalidConfigurationError } from './errors/invalid_configuration.js'

export function defineConfig(config: ShopkeeperConfig): ShopkeeperConfig {
  if (app.inProduction && !config.webhook.secret) {
    throw InvalidConfigurationError.webhookSecretInProduction()
  }

  return config
}
