import { type NormalizeConstructor } from '@adonisjs/core/types/helpers'
import { type BaseModel, column } from '@adonisjs/lucid/orm'
import { InvalidCustomerError } from '../errors/invalid_customer.js'
import type { ManagesStripeContract } from '../contracts.js'

export type ManagesStripeClass<
  Optional extends boolean = true,
  T extends NormalizeConstructor<typeof BaseModel> = NormalizeConstructor<typeof BaseModel>,
> = T & { new (...args: any[]): ManagesStripeContract<Optional> }

export function managesStripe<Optional extends boolean>(_optional: Optional) {
  return <T extends NormalizeConstructor<typeof BaseModel>>(
    superclass: T
  ): ManagesStripeClass<Optional, T> => {
    class EntityMixin extends superclass {
      @column()
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
    }

    return EntityMixin
  }
}

export type WithManagesStripe<Optional extends boolean = true> = ManagesStripeClass<Optional>
