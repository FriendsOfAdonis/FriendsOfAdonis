import { type NormalizeConstructor } from '@adonisjs/core/types/helpers'
import { type BaseModel } from '@adonisjs/lucid/orm'
import type Stripe from 'stripe'
import shopkeeper from '../../services/shopkeeper.js'
import { InvalidCustomerError } from '../errors/invalid_customer.js'

// TODO: Find way to have BaseModel generic
export interface ManagesStripeI<Optional = false> {
  stripeId: Optional extends false ? string : string | null

  /**
   * Determine if the customer has a Stripe customer ID.
   */
  hasStripeId(): boolean

  /**
   * Returns the Stripe ID or fail.
   */
  stripeIdOrFail(): string

  /**
   * Get the Stripe SDK client.
   */
  get stripe(): Stripe
}

type Constructor = NormalizeConstructor<typeof BaseModel>

export function ManagesStripe<Optional extends boolean, Model extends Constructor>(
  _optional: Optional
) {
  return (superclass: Model) => {
    class WithManagesStripeImpl extends superclass implements ManagesStripeI<Optional> {
      declare stripeId: Optional extends false ? string : string | null

      hasStripeId(): boolean {
        return !!this.stripeId
      }

      stripeIdOrFail(): string {
        if (!this.stripeId) {
          throw InvalidCustomerError.notYetCreated(this)
        }
        return this.stripeId
      }

      get stripe(): Stripe {
        return shopkeeper.stripe
      }
    }

    WithManagesStripeImpl.boot()
    WithManagesStripeImpl.$addColumn('stripeId', {})

    return WithManagesStripeImpl
  }
}

export type WithManagesStripe = ReturnType<ReturnType<typeof ManagesStripe>>
