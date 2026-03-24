# Plan: Mock Stripe API calls in shopkeeper tests

## Context

The functional tests hit the real Stripe API (~60 unique SDK method calls across 10 test files). Each test involves multiple round-trips (create customer, attach PM, create subscription, retrieve, etc.). Metered billing tests have `sleep(2)` + `sleep(15)` + polling with 5s intervals because real Stripe processes meter events async.

Goal: replace all real Stripe API calls with a local in-memory mock server for instant responses. Zero test file changes needed.

## Strategy

- **Mock by default** for dev and CI (fast, no Stripe key needed)
- **Optional `--real-stripe` flag** to run against real Stripe API before releases

## Approach: Custom stateful Stripe mock HTTP server

Build a Node.js HTTP server in `tests/stripe_mock/` that implements the Stripe API routes used by the test suite.

The Stripe SDK already supports `host`/`port`/`protocol` config options, and `ShopkeeperConfig` already has `stripe?: Stripe.StripeConfig` (line 111 of `src/types.ts`) which is passed to `new Stripe(config.secret, config.stripe)` (line 27 of `src/shopkeeper.ts`).

**Why not `stripe-mock` (official)?** It's **stateless** — every retrieve/list returns fixture data, not previously created resources. ~40+ test assertions depend on stateful create-then-retrieve patterns. Would require massive test rewrites.

## Files to create

### `tests/stripe_mock/server.ts` — HTTP server + router (~150 lines)
- `http.createServer` on random port (`server.listen(0)`)
- URL-based routing matching `/v1/{resource}/{id?}/{action?}`
- Parse `application/x-www-form-urlencoded` bodies (Stripe SDK format)
- Parse `expand[]` query params
- Export `startMockServer()` → `{ host, port, protocol }` and `stopMockServer()`

### `tests/stripe_mock/store.ts` — In-memory state (~80 lines)
- `Map<string, Record<string, any>>` keyed by resource ID
- `generateId(prefix)` → `cus_fake_xxxx`, `sub_fake_xxxx`, etc.
- `set()`, `get()`, `delete()`, `list(filter)`, `clear()`
- Per-resource prefixes: `cus`, `prod`, `price`, `sub`, `si`, `pi`, `in`, `pm`, `seti`, `re`, `coupon`, `promo`, `txr`, `txi`, `cbtxn`, `cs`, `ii`, `meter`, `me`

### `tests/stripe_mock/parser.ts` — Form body parser (~60 lines)
- Parse bracket notation: `items[0][price]=price_123&metadata[key]=val` → `{ items: [{ price: 'price_123' }], metadata: { key: 'val' } }`
- No external deps — recursive key parser

### `tests/stripe_mock/handlers/` — Resource handlers

Each handler implements CRUD + resource-specific behaviors:

| Handler file | Routes | Special logic |
|---|---|---|
| `generic.ts` (~100 lines) | Base CRUD class | create/retrieve/update/delete/list with store |
| `customers.ts` (~120 lines) | `/v1/customers/*` | Nested balance_transactions, tax_ids. `invoice_settings.default_payment_method` storage |
| `payment_methods.ts` (~80 lines) | `/v1/payment_methods/*` | Magic IDs (`pm_card_visa` → visa/4242, `pm_card_mastercard` → mastercard/4444, `pm_card_chargeCustomerFail`, `pm_card_threeDSecure2Required`). SEPA debit last4 from IBAN. `attach`/`detach` actions |
| `payment_intents.ts` (~100 lines) | `/v1/payment_intents/*` | Status based on PM: `pm_card_chargeCustomerFail` → `requires_payment_method`, `pm_card_threeDSecure2Required` → `requires_action`, else → `succeeded`. `confirm`/`capture`/`cancel` actions |
| `subscriptions.ts` (~180 lines) | `/v1/subscriptions/*` | Build `items.data` from request items with stored prices. `cancel_at_period_end`, `trial_end`, `metadata`. On update with failing PM + `payment_behavior: error_if_incomplete` → 402 card_error |
| `subscription_items.ts` (~60 lines) | `/v1/subscription_items/*` | CRUD + link to parent subscription's items.data |
| `invoices.ts` (~200 lines) | `/v1/invoices/*` | Status transitions: draft→open→paid/void/uncollectible. `pay` action creates PI + checks customer PM for failures. `createPreview` (no persist). `listLineItems` from associated invoice items. `expand` for `payments.data.payment.payment_intent` |
| `checkout.ts` (~80 lines) | `/v1/checkout/sessions` | Compute `amount_total` from line_items × quantity. Handle `discounts` (coupon amount_off) |
| `billing.ts` (~100 lines) | `/v1/billing/meters/*`, `/v1/billing/meter_events` | Store meter events, compute `listEventSummaries` by summing values matching event_name + time range |
| `misc.ts` (~60 lines) | products, prices, coupons, promotionCodes, taxRates, refunds, setupIntents, invoiceItems, billingPortal | All use generic CRUD. promotionCodes.list has `code` filter. billingPortal returns fake `https://billing.stripe.com/...` URL |

**Estimated total: ~1200-1500 lines**, pure TypeScript, zero new runtime deps.

## Complete route map

```
# Customers
POST   /v1/customers
GET    /v1/customers/{id}
POST   /v1/customers/{id}
DELETE /v1/customers/{id}
GET    /v1/customers
POST   /v1/customers/{id}/balance_transactions
GET    /v1/customers/{id}/balance_transactions
POST   /v1/customers/{id}/tax_ids
GET    /v1/customers/{id}/tax_ids
GET    /v1/customers/{id}/tax_ids/{tid}
DELETE /v1/customers/{id}/tax_ids/{tid}
GET    /v1/customers/{id}/payment_methods

# Products
POST   /v1/products
GET    /v1/products/{id}

# Prices
POST   /v1/prices
GET    /v1/prices/{id}

# Coupons
POST   /v1/coupons
GET    /v1/coupons/{id}

# Promotion Codes
POST   /v1/promotion_codes
GET    /v1/promotion_codes/{id}
GET    /v1/promotion_codes

# Payment Methods
POST   /v1/payment_methods
GET    /v1/payment_methods/{id}
POST   /v1/payment_methods/{id}/attach
POST   /v1/payment_methods/{id}/detach
GET    /v1/payment_methods

# Payment Intents
POST   /v1/payment_intents
GET    /v1/payment_intents/{id}
POST   /v1/payment_intents/{id}
POST   /v1/payment_intents/{id}/confirm
POST   /v1/payment_intents/{id}/capture
POST   /v1/payment_intents/{id}/cancel

# Setup Intents
POST   /v1/setup_intents
GET    /v1/setup_intents/{id}

# Refunds
POST   /v1/refunds

# Subscriptions
POST   /v1/subscriptions
GET    /v1/subscriptions/{id}
POST   /v1/subscriptions/{id}
DELETE /v1/subscriptions/{id}
GET    /v1/subscriptions
POST   /v1/subscriptions/{id}/resume
DELETE /v1/subscriptions/{id}/discount

# Subscription Items
POST   /v1/subscription_items
GET    /v1/subscription_items/{id}
POST   /v1/subscription_items/{id}
DELETE /v1/subscription_items/{id}

# Invoices
POST   /v1/invoices
GET    /v1/invoices/{id}
POST   /v1/invoices/{id}
DELETE /v1/invoices/{id}
GET    /v1/invoices
POST   /v1/invoices/create_preview       ← register before /{id} routes
GET    /v1/invoices/{id}/lines
POST   /v1/invoices/{id}/pay
POST   /v1/invoices/{id}/send
POST   /v1/invoices/{id}/finalize
POST   /v1/invoices/{id}/void
POST   /v1/invoices/{id}/mark_uncollectible

# Invoice Items
POST   /v1/invoiceitems

# Tax Rates
POST   /v1/tax_rates

# Checkout Sessions
POST   /v1/checkout/sessions

# Billing Portal Sessions
POST   /v1/billing_portal/sessions

# Billing Meters
POST   /v1/billing/meters
GET    /v1/billing/meters/{id}
GET    /v1/billing/meters
GET    /v1/billing/meters/{id}/event_summaries

# Billing Meter Events
POST   /v1/billing/meter_events
```

## Files to modify

### `tests/app_config.ts`
Add `stripe` config to redirect SDK to mock server:
```ts
shopkeeper: defineConfig({
  // ...existing...
  stripe: {
    host: '127.0.0.1',
    port: Number(process.env.STRIPE_MOCK_PORT),
    protocol: 'http',
  },
}),
```

### `bin/test.ts`
Start mock server **before** `createApp()` (line 10) since Shopkeeper is instantiated during app boot:
```ts
import { startMockServer, stopMockServer } from '../tests/stripe_mock/server.js'

// Start mock unless --real-stripe flag is passed
const useRealStripe = process.argv.includes('--real-stripe')
if (!useRealStripe) {
  const mockServer = await startMockServer()
  process.env.STRIPE_MOCK_PORT = String(mockServer.port)
}

const { app } = await createApp()
// ...existing configure()...
// Add stopMockServer to teardown:
teardown: [() => app.terminate(), () => !useRealStripe && stopMockServer()]
```

### `tests/functional/metered_billing.spec.ts` (optional optimization)
Remove or reduce `sleep(2)` and `sleep(15)` calls since mock processes events synchronously. Saves ~17 seconds.

## Key design details

### Error simulation
When `POST /v1/invoices/{id}/pay` is called, look up the invoice's customer → get their default PM → if it's a failing card, return HTTP 402 with `{ error: { type: 'card_error', code: 'card_declined' } }`. The Stripe SDK automatically converts 402s to `StripeCardError`.

### Subscription items
When `POST /v1/subscriptions` receives `items[0][price]=price_xxx`, look up the price from the store and embed the full price object in the subscription's `items.data[0].price`. Critical since tests assert on `stripeSubscription.items.data[0].price.unit_amount`.

### Expand handling
Only needed for `invoices.retrieve` with `expand: ['payments.data.payment.payment_intent']`. The invoice stores a `_paymentIntentId` ref; on retrieve with expand, resolve and embed it.

### Magic payment method IDs
| ID | Type | Brand | Last4 | Behavior |
|---|---|---|---|---|
| `pm_card_visa` | card | visa | 4242 | Succeeds |
| `pm_card_mastercard` | card | mastercard | 4444 | Succeeds |
| `pm_card_chargeCustomerFail` | card | visa | 0341 | Decline → 402 card_error |
| `pm_card_threeDSecure2Required` | card | visa | 3155 | PI status `requires_action` |

### No source code changes
Everything goes through `ShopkeeperConfig.stripe` which is already wired up.

## Verification

1. Run `node --import=./tsnode.esm.js bin/test.ts --filter="functional"` — all functional tests should pass
2. Compare execution time: should drop from minutes to seconds
3. No `.env` STRIPE_SECRET needed anymore for mock tests
4. Run `node --import=./tsnode.esm.js --env-file .env bin/test.ts --filter="functional" -- --real-stripe` — tests pass against real Stripe (for pre-release validation)
5. CI runs without Stripe API key dependency by default
