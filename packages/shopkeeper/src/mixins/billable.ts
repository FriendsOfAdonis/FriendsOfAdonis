/// <reference types="@poppinss/hooks" />

import { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import { BaseModel } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { ManagesCustomer } from './manages_customer.js'
import { ManagesPaymentMethods } from './manages_payment_methods.js'
import { HandlesTaxes } from './handles_taxes.js'
import { ManagesInvoices } from './manages_invoices.js'
import { ManagesSubscriptions } from './manages_subscriptions.js'
import { ManagesStripe } from './manages_stripe.js'
import { PerformCharges } from './performs_charges.js'

export function Billable<Model extends NormalizeConstructor<typeof BaseModel>>(superclass: Model) {
  class WithBillableImpl1 extends compose(
    superclass,
    ManagesStripe(true),
    HandlesTaxes,
    ManagesCustomer,
    ManagesPaymentMethods,
    ManagesInvoices
  ) {}

  class WithBillableImpl2 extends compose(
    WithBillableImpl1,
    ManagesSubscriptions,
    PerformCharges
  ) {}

  WithBillableImpl2.boot()
  WithBillableImpl2.$addColumn('stripeId', {})

  return WithBillableImpl2
}

export type WithBillable = ReturnType<typeof Billable>
