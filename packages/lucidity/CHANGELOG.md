# @foadonis/graphql

## 1.0.0-next.0

### Major Changes

- [`ea99649`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/ea996495e36a2c57cf0c4eb06e20ab77aa25ac8b) Thanks [@kerwanp](https://github.com/kerwanp)! - GraphQL v1 🚀

  ## New features
  - ✨ Support for AdonisJS V7
  - ✨ Support for Yoga and Apollo server
  - ✨ Built-in support for PubSub system (native and redis)
  - ✨ Built-in support for Subscriptions over Websocket
  - ✨ Resolvers autoloading with HMR support
  - ✨ make:resolver command

  ## How to migrate

  Update the `config/graphql.ts`:

  ```ts
  import { defineConfig, drivers, pubsubs } from '@foadonis/graphql'

  export default defineConfig({
    path: '/graphql',

    driver: drivers.apollo({
      playground: true,
      introspection: true,
    }),

    logger: 'app',

    emitSchemaFile: true,
  })
  ```

  Remove the `start/graphql.ts` as resolvers are now autoloaded.

  Install `@graphql-yoga/subscription`:

  ```bash
  npm i @graphql-yoga/subscription
  ```

## 0.1.0

### Minor Changes

- [#92](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/92) [`ae03e93`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/ae03e931698333bb891956853559bcf0c482fc9e) Thanks [@kerwanp](https://github.com/kerwanp)! - Bump dependencies

## 0.0.9

### Patch Changes

- [#80](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/80) [`e0edafe`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/e0edafeff25a38cc61c02806004510718def0524) Thanks [@kerwanp](https://github.com/kerwanp)! - Bump dependencies

## 0.0.8

### Patch Changes

- [#59](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/59) [`77a8b95`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/77a8b953bf07d1a580c48b0df9149a3a74ce0148) Thanks [@kerwanp](https://github.com/kerwanp)! - feat: Propose to install required dependencies during configuration

## 0.0.7

### Patch Changes

- [#43](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/43) [`b11da2f`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/b11da2fa8a393adaf54b794eb793d816c5ff602c) Thanks [@kerwanp](https://github.com/kerwanp)! - Upgrade dependencies

- [#47](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/47) [`28dedde`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/28dedded66376e57bbd76bfc1c02210ff619b044) Thanks [@kerwanp](https://github.com/kerwanp)! - bump versions

## 0.0.6

### Patch Changes

- [#25](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/25) [`32de549`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/32de54973ce8cc95e9e961b07879051f7d0f52ab) Thanks [@kerwanp](https://github.com/kerwanp)! - Add pretty configure success log

- [#25](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/25) [`32de549`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/32de54973ce8cc95e9e961b07879051f7d0f52ab) Thanks [@kerwanp](https://github.com/kerwanp)! - Follow standard for provider export

## 0.0.5

### Patch Changes

- [`22d5326`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/22d532670e889dc39fd86b7a968ee940a416f7d6) Thanks [@kerwanp](https://github.com/kerwanp)! - Fix build pipeline to properly include commands manifest and stubs

## 0.0.4

### Patch Changes

- [#20](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/20) [`e3de566`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/e3de566a8a6c7ef10d9f7326be90a910a1c8565c) Thanks [@kerwanp](https://github.com/kerwanp)! - Migrate repository to Yarn 4

## 0.0.3

### Patch Changes

- [#16](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/16) [`dd889cc`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/dd889cca8b7dddfbb7a1d476076d2895b7274dd5) Thanks [@kerwanp](https://github.com/kerwanp)! - upgrade dependencies

## 0.0.2

### Patch Changes

- [#8](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/8) [`3d63454`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/3d63454a855df620353808648b02a57ba15041f2) Thanks [@kerwanp](https://github.com/kerwanp)! - fix builds

## 0.0.1

### Patch Changes

- [#2](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/2) [`03cfc38`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/03cfc3878a2fe215be751160d7996441698e5298) Thanks [@kerwanp](https://github.com/kerwanp)! - Initial release
