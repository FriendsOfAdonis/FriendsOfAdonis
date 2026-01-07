import type Stripe from 'stripe'
import shopkeeper from '../../services/shopkeeper.js'

type Constructor = new (...args: any[]) => {}

export function HandlesTaxes<Model extends Constructor>(superclass: Model) {
  return class WithHandlesTaxes extends superclass implements WithHandlesTaxes {
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
    automaticTaxPayload(): Stripe.SubscriptionCreateParams.AutomaticTax {
      return {
        // TODO: Check if necessary
        // customer_ip_address: this.customerIpAddress,
        // estimation_billing_address: this.estimationBillingAddress,
        enabled: this.isAutomaticTaxEnabled(),
      }
    }

    /**
     * Determine if automatic tax is enabled.
     */
    isAutomaticTaxEnabled(): boolean {
      return shopkeeper.calculateTaxes
    }

    /**
     * Indicate that Tax IDs should be collected during a Stripe Checkout session.
     */
    withTaxIdsCollect(): void {
      this.collectTaxIds = true
    }
  }
}

export type WithHandlesTaxes = ReturnType<typeof HandlesTaxes>
