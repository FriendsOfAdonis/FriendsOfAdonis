import { Exception } from '@adonisjs/core/exceptions'

export class InvalidWebhookError extends Exception {
  static missingSignature() {
    return new InvalidWebhookError('Missing Stripe webhook signature or body.', {
      code: 'E_STRIPE_WEBHOOK_MISSING_SIGNATURE',
      status: 400,
    })
  }

  static missingSecret() {
    return new InvalidWebhookError(
      'Stripe webhook secret is not configured. Set the STRIPE_WEBHOOK_SECRET environment variable.',
      { code: 'E_STRIPE_WEBHOOK_MISSING_SECRET', status: 500 }
    )
  }

  static invalidSignature() {
    return new InvalidWebhookError('Stripe webhook signature verification failed.', {
      code: 'E_STRIPE_WEBHOOK_INVALID_SIGNATURE',
      status: 400,
    })
  }

  static invalidPayload() {
    return new InvalidWebhookError('Invalid Stripe event payload.', {
      code: 'E_STRIPE_WEBHOOK_INVALID_SIGNATURE',
      status: 400,
    })
  }
}
