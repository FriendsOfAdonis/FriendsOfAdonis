# @foadonis/shopkeeper

## 1.0.1

### Patch Changes

- [#133](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/133) [`9cc73fc`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/9cc73fc6e58340b736eb30879f466ecabfe038bc) Thanks [@kerwanp](https://github.com/kerwanp)! - Fix package deployment workflow

## 1.0.0

### Major Changes

- [#116](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/116) [`3d1e30d`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/3d1e30d9b326bf6e051f453e7eb73a1e355d1450) Thanks [@densetsuuu](https://github.com/densetsuuu)! - Shopkeeper 1.0.0 — full rewrite with breaking changes across the public API.

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

## 0.1.7

### Patch Changes

- [#80](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/80) [`e0edafe`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/e0edafeff25a38cc61c02806004510718def0524) Thanks [@kerwanp](https://github.com/kerwanp)! - Bump dependencies

## 0.1.6

### Patch Changes

- [#43](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/43) [`b11da2f`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/b11da2fa8a393adaf54b794eb793d816c5ff602c) Thanks [@kerwanp](https://github.com/kerwanp)! - Upgrade dependencies

- [#47](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/47) [`28dedde`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/28dedded66376e57bbd76bfc1c02210ff619b044) Thanks [@kerwanp](https://github.com/kerwanp)! - bump versions

## 0.1.5

### Patch Changes

- [#25](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/25) [`32de549`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/32de54973ce8cc95e9e961b07879051f7d0f52ab) Thanks [@kerwanp](https://github.com/kerwanp)! - Add pretty configure success log

## 0.1.4

### Patch Changes

- [`22d5326`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/22d532670e889dc39fd86b7a968ee940a416f7d6) Thanks [@kerwanp](https://github.com/kerwanp)! - Fix build pipeline to properly include commands manifest and stubs

## 0.1.3

### Patch Changes

- [#20](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/20) [`e3de566`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/e3de566a8a6c7ef10d9f7326be90a910a1c8565c) Thanks [@kerwanp](https://github.com/kerwanp)! - Fix type reference to @poppinss/hooks

- [#20](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/20) [`e3de566`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/e3de566a8a6c7ef10d9f7326be90a910a1c8565c) Thanks [@kerwanp](https://github.com/kerwanp)! - Migrate repository to Yarn 4

## 0.1.2

### Patch Changes

- [#16](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/16) [`dd889cc`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/dd889cca8b7dddfbb7a1d476076d2895b7274dd5) Thanks [@kerwanp](https://github.com/kerwanp)! - upgrade dependencies

## 0.1.1

### Patch Changes

- [#8](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/8) [`3d63454`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/3d63454a855df620353808648b02a57ba15041f2) Thanks [@kerwanp](https://github.com/kerwanp)! - fix builds

## 0.1.0

### Minor Changes

- [#2](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/2) [`03cfc38`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/03cfc3878a2fe215be751160d7996441698e5298) Thanks [@kerwanp](https://github.com/kerwanp)! - Migrate to monorepository
