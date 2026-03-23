# @foadonis/shopkeeper## 0.2.0

### Breaking Changes

- **Stripe SDK `^17` → `^20.4.1`** — types invoice, discount, tax, line items, metered billing
- **Peers: `@adonisjs/core ^7.0.1`, `@adonisjs/lucid ^22.1.1`**
- **`Billable` → `billable()`** — mixin renommé en factory : `compose(BaseModel, billable())`
- **Getter `this.stripe` supprimé** des modèles — utiliser `await Shopkeeper.resolveStripe()`
- **`CustomerBalanceTransaction`** — constructeur sans `owner`, `invoice()` → `invoiceId()`
- **`Tax`** — constructeur prend `taxRateId: string | null`, `isInclusive()` supprimé, `taxRate()` → `taxRateId()`
- **`Invoice`** — n'accepte plus `Stripe.UpcomingInvoice`, `tax`/`total_tax_amounts` → `total_taxes`, line items filtrés via `parent.type`
- **`InvoiceLineItem.hasTaxRates()`** — utilise `item.taxes` (Stripe v20)
- **Types `With*` supprimés** — remplacés par les interfaces `*Contract` dans `contracts.ts`
- **Mixins class-style → factory** — `HandlesTaxes`, `AllowsCoupon`, `HandlesPaymentFailures`, `InteractWithPaymentBehavior`, `Prorates` → `handlesTaxes()`, `allowsCoupon()`, `handlesPaymentFailures()`, `interactWithPaymentBehavior()`, `prorates()`
- **Metered billing → Billing Meters v2** — `reportUsage()` via `meterEvents.create()`, prix liés à un `Meter`

### Améliorations

- `Shopkeeper.resolveStripe()` / `Shopkeeper.formatAmount()` — helpers statiques
- Webhook middleware avec injection IoC et erreurs typées (`InvalidWebhookError`)
- `checkStripeError()` accepte `unknown`, nouveau type guard `isStripeEvent()`
- Contracts centralisés (`ManagesStripeContract`, `BillableContract`, etc.)
- Subscription swap réutilise les item IDs pour des prorations correctes (Stripe v20)
- Suppression de tous les `as` assertions et `any`

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
