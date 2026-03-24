# Upgrading to @foadonis/shopkeeper 0.2.0

## Automated migration with Claude Code

Download the [migration command](https://github.com/FriendsOfAdonis/FriendsOfAdonis/blob/main/packages/shopkeeper/.claude/commands/migrate-shopkeeper.md) into your project and run `/migrate-shopkeeper` in Claude Code:

```sh
mkdir -p .claude/commands && curl -sO --output-dir .claude/commands https://raw.githubusercontent.com/FriendsOfAdonis/FriendsOfAdonis/main/packages/shopkeeper/.claude/commands/migrate-shopkeeper.md
```

## 1. Update dependencies

```sh
npm install @foadonis/shopkeeper@^0.2.0
```

Peer dependencies: `@adonisjs/core ^7.0.1`, `@adonisjs/lucid ^22.1.1`, `luxon ^3.5.0`.

## 2. Generate and run the new migration

```sh
node ace shopkeeper:migration
node ace migration:run
```

This creates the `stripe_webhook_events` table used for webhook idempotency.

## 3. Convert mixins to factory pattern

All mixins are now factory functions. Add `()` after each mixin name:

```diff
- import { Billable } from '@foadonis/shopkeeper/mixins'
+ import { billable } from '@foadonis/shopkeeper/mixins'

- class User extends compose(BaseModel, Billable) {}
+ class User extends compose(BaseModel, billable()) {}
```

Full rename list:

| Before | After |
|---|---|
| `Billable` | `billable()` |
| `HandlesTaxes` | `handlesTaxes()` |
| `AllowsCoupon` | `allowsCoupon()` |
| `HandlesPaymentFailures` | `handlesPaymentFailures()` |
| `InteractWithPaymentBehavior` | `interactWithPaymentBehavior()` |
| `Prorates` | `prorates()` |

## 4. Replace `this.stripe` with `Shopkeeper.resolveStripe()`

The `stripe` getter has been removed from models. Resolve it via IoC instead:

```diff
+ import { Shopkeeper } from '@foadonis/shopkeeper'

- const stripe = this.stripe
+ const stripe = await Shopkeeper.resolveStripe()
```

## 5. Replace `With*` types with `*Contract` interfaces

```diff
- import type { WithSubscriptions, WithCustomer } from '@foadonis/shopkeeper/types'
+ import type { BillableContract } from '@foadonis/shopkeeper'
```

## 6. Stripe SDK v20 API changes

### Invoice

```diff
- invoice.tax
- invoice.total_tax_amounts
+ invoice.total_taxes
```

### CustomerBalanceTransaction

```diff
- new CustomerBalanceTransaction(owner, transaction)
+ new CustomerBalanceTransaction(transaction)

- balanceTransaction.invoice()
+ balanceTransaction.invoiceId()
```

### Tax

```diff
- new Tax(amount, currency, taxRate)
+ new Tax(amount, currency, taxRateId)

- tax.taxRate()
+ tax.taxRateId()

- tax.isInclusive() // removed, no replacement
```

### InvoiceLineItem

`hasTaxRates()` now reads from `item.taxes` instead of `item.tax_amounts`.

## 7. Metered billing (Billing Meters v2)

`reportUsage()` is removed. Use the Stripe Billing Meters API directly:

```diff
- await subscriptionItem.reportUsage(quantity)
+ const stripe = await Shopkeeper.resolveStripe()
+ await stripe.billing.meterEvents.create({
+   event_name: 'my_meter',
+   payload: {
+     stripe_customer_id: user.stripeId,
+     value: String(quantity),
+   },
+ })
```

Prices must be linked to a `Meter` in your Stripe dashboard.
