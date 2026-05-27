---
'@foadonis/shopkeeper': major
---

Shopkeeper 0.2.0 — full rewrite with breaking changes across the public API.

See the [migration guide](https://friendsofadonis.com/docs/shopkeeper/migration) for step-by-step upgrade instructions.

### Highlights

- Migrated to Stripe SDK v20.
- Mixins rewritten as factory functions (`billable()`, `handlesTaxes()`, …) for stronger type safety and DX.
- Replaced the service locator with an IoC container and a `shopkeeper` singleton service.
- Routes and webhook listeners are now registered explicitly via `shopkeeper.registerRoutes()` / `shopkeeper.registerWebhookListeners()`.
- Idempotent webhook handling backed by a new `stripe_webhook_events` table, with opt-in `webhookAudit`.
- New fluent `CheckoutBuilder` API (product, subscription, guest) with required `success_url` / `cancel_url`.
- New fluent `InvoiceBuilder` API replacing `tab*` / `invoiceFor` / `invoicePrice`.
- Metered billing migrated to Stripe Billing Meters (`subscription.reportUsage('event', qty)`).
- `With*` types replaced by `*Contract` interfaces; `stripe` getter removed from models (use the `shopkeeper` service).
- Config additions: `webhook.enforceSecret`, `keepPastDueSubscriptionsActive`, `registerRoutes`.
