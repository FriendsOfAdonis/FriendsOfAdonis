import type Stripe from 'stripe'
import { type StripeEventTypes } from './types.js'

export const WEBHOOK_EVENTS: StripeEventTypes[] = [
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.updated',
  'customer.deleted',
  'payment_method.automatically_updated',
  'invoice.payment_action_required',
  'invoice.payment_succeeded',
]

export const STRIPE_VERSION: Stripe.WebhookEndpointCreateParams.ApiVersion = '2023-10-16'
