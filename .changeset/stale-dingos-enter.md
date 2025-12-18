---
'@foadonis/graphql': minor
---

Road to GraphQL v1 🚀

## New features

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
