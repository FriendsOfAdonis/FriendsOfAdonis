import { Exception } from '@adonisjs/core/exceptions'

export class InvalidConfigurationError extends Exception {
  static code = 'E_INVALID_CONFIGURATION'

  static webhookSecretInProduction() {
    return new InvalidConfigurationError(
      'The webhook secret is mandatory in production. Make sure the `STRIPE_WEBHOOK_SECRET` is configured.'
    )
  }
}
