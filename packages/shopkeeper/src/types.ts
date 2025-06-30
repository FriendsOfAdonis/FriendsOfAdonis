// Used as based class for mixins.

import Stripe from 'stripe'
import { WithBillable } from './mixins/billable.js'
import Subscription from './models/subscription.js'
import SubscriptionItem from './models/subscription_item.js'
import { NormalizeConstructor } from '@poppinss/utils/types'

// I'm sure there is a better way but i'll figure out later
export class Empty {}

type LazyImport<DefaultExport> = () => Promise<{
  default: DefaultExport
}>

export type ShopkeeperConfig = {
  /**
   * The Stripe publishable key.
   */
  key: string

  /**
   * The Stripe secret key.
   */
  secret: string

  /**
   * Webhook configuration.
   */
  webhook: {
    /**
     * Signing secret.
     * Webhooks are not validated when this option is not defined.
     *
     * In production, this is a required parameter.
     */
    secret?: string

    /**
     * Signature timing shift tolerance.
     */
    tolerance: number

    /**
     * List of events that will be configured on the generated webhook using `node ace shopkeeper:webhook`.
     */
    events?: StripeEventTypes[]
  }

  /**
   * The default currency that will be used when generating charges from you application.
   */
  currency: string

  /**
   * The default currency locale that will be used when generating charges from you application.
   */
  currencyLocale: string

  /**
   * Models configuration.
   */
  models: {
    /**
     * Configures your Billable model.
     *
     * @example () => import('#models/user')
     */
    customerModel: LazyImport<WithBillable>

    /**
     * The Subscription model import.
     *
     * @example () => import('#models/subscription')
     */
    subscriptionModel: LazyImport<NormalizeConstructor<typeof Subscription>>

    /**
     * The SubscriptionItem model import.
     *
     * @example () => import('#models/subscription_item')
     */
    subscriptionItemModel: LazyImport<NormalizeConstructor<typeof SubscriptionItem>>
  }

  /**
   * Enables automatic tax calculation.
   */
  calculateTaxes: boolean

  /**
   * Keep incomplete subscriptions active.
   */
  keepIncompleteSubscriptionsActive: boolean

  /**
   * Keep past due subscriptions active.
   */
  keepPastDueSubscriptionsActive: boolean

  /**
   * Defines the configuration used to create the Stripe SDK Instance.
   */
  stripe?: Stripe.StripeConfig
}

export type StripeEventTypes = Stripe.Event['type']

// TODO: IT works but it is slow asf
// type StripeEventName<T extends string> = T extends `stripe:${infer U}`
//   ? Stripe.Event & { type: U }
//   : never
// type StrictStripeEventList = {
//   [key in `stripe:${StripeEventTypes}`]: StripeEventName<key>
// }

type RelaxedStripeEventList = {
  [key in `stripe:${StripeEventTypes}` | `stripe:${StripeEventTypes}:handled`]: any
}

declare module '@adonisjs/core/types' {
  interface EventsList extends RelaxedStripeEventList {}
}
