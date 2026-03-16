/// <reference types="@poppinss/hooks" />

import { type NormalizeConstructor } from '@adonisjs/core/types/helpers'
import { type BaseModel } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { managesCustomer } from './manages_customer.js'
import { managesPaymentMethods } from './manages_payment_methods.js'
import { HandlesTaxes } from './handles_taxes.js'
import { managesInvoices } from './manages_invoices.js'
import { managesSubscriptions } from './manages_subscriptions.js'
import { managesStripe } from './manages_stripe.js'
import { performCharges } from './performs_charges.js'

export function billable() {
  return <Model extends NormalizeConstructor<typeof BaseModel>>(superclass: Model) => {
    return class EntityMixin extends compose(
      superclass,
      managesStripe(true),
      HandlesTaxes,
      managesCustomer(),
      managesPaymentMethods(),
      managesInvoices(),
      managesSubscriptions(),
      performCharges()
    ) {}
  }
}
