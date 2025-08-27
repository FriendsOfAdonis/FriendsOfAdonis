# @foadonis/openapi

## 0.4.1

### Patch Changes

- [#80](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/80) [`e0edafe`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/e0edafeff25a38cc61c02806004510718def0524) Thanks [@kerwanp](https://github.com/kerwanp)! - Bump dependencies

## 0.4.0

### Minor Changes

- [#77](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/77) [`d1dfe1a`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/d1dfe1ad0cca085256a14ca363710949da65c645) Thanks [@kerwanp](https://github.com/kerwanp)! - Remove content negotiation in favor of file extensions for documentation format.

  When registering OpenAPI routes you will now have 3 registered routes:
  - /api - returns the OpenAPI documentation UI
  - /api.json - returns the OpenAPI documentation in JSON format
  - /api.yaml - returns the OpenAPI documentation in YAML format

  The routes are named `openapi.html`, `openapi.json` and `openapi.yaml`.

### Patch Changes

- [#77](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/77) [`d1dfe1a`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/d1dfe1ad0cca085256a14ca363710949da65c645) Thanks [@kerwanp](https://github.com/kerwanp)! - Avoid overriding existing operations documentation by merging with existing metadata.

- [#77](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/77) [`d1dfe1a`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/d1dfe1ad0cca085256a14ca363710949da65c645) Thanks [@kerwanp](https://github.com/kerwanp)! - Automatically convert AdonisJS paths to OpenAPI compliant paths
  For example `/users/:id` become `/users/{id}`.

## 0.3.5

### Patch Changes

- [#43](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/43) [`b11da2f`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/b11da2fa8a393adaf54b794eb793d816c5ff602c) Thanks [@kerwanp](https://github.com/kerwanp)! - Upgrade dependencies

- [#47](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/47) [`28dedde`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/28dedded66376e57bbd76bfc1c02210ff619b044) Thanks [@kerwanp](https://github.com/kerwanp)! - bump versions

## 0.3.4

### Patch Changes

- [#25](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/25) [`32de549`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/32de54973ce8cc95e9e961b07879051f7d0f52ab) Thanks [@kerwanp](https://github.com/kerwanp)! - Add pretty configure success log

## 0.3.3

### Patch Changes

- [`22d5326`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/22d532670e889dc39fd86b7a968ee940a416f7d6) Thanks [@kerwanp](https://github.com/kerwanp)! - Fix build pipeline to properly include commands manifest and stubs

## 0.3.2

### Patch Changes

- [#20](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/20) [`e3de566`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/e3de566a8a6c7ef10d9f7326be90a910a1c8565c) Thanks [@kerwanp](https://github.com/kerwanp)! - Add ability to serve documentation on different path

- [#20](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/20) [`e3de566`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/e3de566a8a6c7ef10d9f7326be90a910a1c8565c) Thanks [@kerwanp](https://github.com/kerwanp)! - Migrate repository to Yarn 4

## 0.3.1

### Patch Changes

- [#16](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/16) [`dd889cc`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/dd889cca8b7dddfbb7a1d476076d2895b7274dd5) Thanks [@kerwanp](https://github.com/kerwanp)! - upgrade dependencies

## 0.3.0

### Minor Changes

- [#10](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/10) [`be26c49`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/be26c49409b5ff88fee20ac75a32a3b0e39b369f) Thanks [@kerwanp](https://github.com/kerwanp)! - Use content negotiation to display UI or OpenAPI document

- [#10](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/10) [`be26c49`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/be26c49409b5ff88fee20ac75a32a3b0e39b369f) Thanks [@kerwanp](https://github.com/kerwanp)! - Add UI configuration option

- [#10](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/10) [`be26c49`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/be26c49409b5ff88fee20ac75a32a3b0e39b369f) Thanks [@kerwanp](https://github.com/kerwanp)! - Upgrade to latest openapi-metadata version

### Patch Changes

- [#10](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/10) [`be26c49`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/be26c49409b5ff88fee20ac75a32a3b0e39b369f) Thanks [@kerwanp](https://github.com/kerwanp)! - Add comments for clarity and better documentation

## 0.2.1

### Patch Changes

- [#8](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/8) [`3d63454`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/3d63454a855df620353808648b02a57ba15041f2) Thanks [@kerwanp](https://github.com/kerwanp)! - fix builds

## 0.2.0

### Minor Changes

- [#6](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/6) [`1977755`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/19777552fbf8f243b691b0ff3faad02424425ccd) Thanks [@kerwanp](https://github.com/kerwanp)! - Ability to configure custom loaders and controllers

## 0.1.1

### Patch Changes

- [#2](https://github.com/FriendsOfAdonis/FriendsOfAdonis/pull/2) [`03cfc38`](https://github.com/FriendsOfAdonis/FriendsOfAdonis/commit/03cfc3878a2fe215be751160d7996441698e5298) Thanks [@kerwanp](https://github.com/kerwanp)! - Initial release
