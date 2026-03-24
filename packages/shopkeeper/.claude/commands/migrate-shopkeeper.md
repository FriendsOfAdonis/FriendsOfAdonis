Migrate this project from @foadonis/shopkeeper 0.1.x to 0.2.0. Apply all the following changes across the codebase.

## Mixin renames

All mixins changed from class-style to factory functions. Search and replace imports and usages:

- `Billable` → `billable()`
- `HandlesTaxes` → `handlesTaxes()`
- `AllowsCoupon` → `allowsCoupon()`
- `HandlesPaymentFailures` → `handlesPaymentFailures()`
- `InteractWithPaymentBehavior` → `interactWithPaymentBehavior()`
- `Prorates` → `prorates()`

In `compose()` calls, replace `compose(BaseModel, Billable)` with `compose(BaseModel, billable())`.

## Stripe access

`this.stripe` getter is removed from models. Replace all occurrences:

- `this.stripe` → `await Shopkeeper.resolveStripe()`
- Add `import { Shopkeeper } from '@foadonis/shopkeeper'` where needed.

## Type renames

`With*` types are removed. Replace with `*Contract` interfaces from `@foadonis/shopkeeper`:

- `WithSubscriptions`, `WithCustomer`, etc. → `BillableContract`

## Stripe v20 API changes

- `invoice.tax` and `invoice.total_tax_amounts` → `invoice.total_taxes`
- `new CustomerBalanceTransaction(owner, tx)` → `new CustomerBalanceTransaction(tx)`
- `balanceTransaction.invoice()` → `balanceTransaction.invoiceId()`
- `new Tax(amount, currency, taxRate)` → `new Tax(amount, currency, taxRateId)`
- `tax.taxRate()` → `tax.taxRateId()`
- `tax.isInclusive()` → removed, delete any usage
- `InvoiceLineItem.hasTaxRates()` now reads `item.taxes` instead of `item.tax_amounts`

## Metered billing

`reportUsage()` is removed. Replace with Stripe Billing Meters API:

```typescript
// Before
await subscriptionItem.reportUsage(quantity)

// After
const stripe = await Shopkeeper.resolveStripe()
await stripe.billing.meterEvents.create({
  event_name: 'my_meter',
  payload: {
    stripe_customer_id: user.stripeId,
    value: String(quantity),
  },
})
```

## Cleanup

Once all changes are applied and verified, delete this file (`.claude/commands/migrate-shopkeeper.md`).
