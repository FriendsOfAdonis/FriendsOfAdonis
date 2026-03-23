import type Stripe from 'stripe'
import app from '@adonisjs/core/services/app'
import { type ShopkeeperConfig } from '../types.js'
import type { HandlesTaxesContract } from '../contracts.js'

type Constructor = new (...args: any[]) => {}

export type HandlesTaxesClass<T extends Constructor = Constructor> = T & {
  new (...args: any[]): HandlesTaxesContract
}

export function HandlesTaxes<T extends Constructor>(superclass: T): HandlesTaxesClass<T> {
  class WithHandlesTaxes extends superclass {
    /**
     * The IP address of the customer used to determine the tax location.
     */
    customerIpAddress: string | null = null

    /**
     * The pre-collected billing address used to estimate tax rates when performing "one-off" charges.
     */
    estimationBillingAddress: Partial<Stripe.Address> = {}

    /**
     * Indicates if Tax IDs should be collected during a Stripe Checkout session.
     */
    collectTaxIds = false

    /**
     * Set the The IP address of the customer used to determine the tax location.
     */
    withTaxIpAddress(ipAddress: string): void {
      this.customerIpAddress = ipAddress
    }

    /**
     * Set a pre-collected billing address used to estimate tax rates when performing "one-off" charges.
     */
    withTaxAddress(country: string, postalCode?: string, state?: string): void {
      this.estimationBillingAddress = {
        country,
        postal_code: postalCode,
        state,
      }
    }

    /**
     * Get the payload for Stripe automatic tax calculation.
     */
    automaticTaxPayload(): Stripe.InvoiceCreateParams.AutomaticTax {
      return {
        enabled: this.isAutomaticTaxEnabled(),
      }
    }

    /**
     * Determine if automatic tax is enabled.
     */
    isAutomaticTaxEnabled(): boolean {
      return app.config.get<ShopkeeperConfig>('shopkeeper').calculateTaxes
    }

    /**
     * Indicate that Tax IDs should be collected during a Stripe Checkout session.
     */
    withTaxIdsCollect(): void {
      this.collectTaxIds = true
    }
  }

  return WithHandlesTaxes
}

export type WithHandlesTaxes = HandlesTaxesClass
