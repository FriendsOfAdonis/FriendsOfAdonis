<div align="center">
<br/>

## @foadonis/autoloader

### NodeJS module autoloader with HMR support

<br/>
</div>

<div align="center">

<!-- automd:badges color="brightgreen" license name="@foadonis/autoloader" bundlephobia packagephobia -->

[![npm version](https://img.shields.io/npm/v/@foadonis/autoloader?color=brightgreen)](https://npmjs.com/package/@foadonis/autoloader)
[![npm downloads](https://img.shields.io/npm/dm/@foadonis/autoloader?color=brightgreen)](https://npm.chart.dev/@foadonis/autoloader)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@foadonis/autoloader?color=brightgreen)](https://bundlephobia.com/package/@foadonis/autoloader)
[![install size](https://badgen.net/packagephobia/install/@foadonis/autoloader?color=brightgreen)](https://packagephobia.com/result?p=@foadonis/autoloader)

<!-- /automd -->

<!-- automd:coverage from="branches,functions" -->

![Coverage](https://img.shields.io/badge/coverage-66%25-orange)

<!-- /automd -->

</div>

## Getting Started

```bash
npm install @foadonis/autoloader
```

This library provides a way to autoload files that matches a specific pattern. It integrates nicely with [hot-hook](https://github.com/Julien-R44/hot-hook) to support Hot Module Reloading.

### Example

In the following example we autoload all modules that matches `app/graphql/resolvers/**/*_resolver.(ts|tsx|js|jsx)` to register them inside our GraphQL server.

Once the GraphQL server started we start watching for added, reloaded and removed modules.

```ts
import { Autoloader } from '@foadonis/autoloader'

const server = new GraphQLServer()

const autoloader = new Autoloader({
  path: new URL('app/graphql/resolvers', app.appRoot),
  glob: '**/*_resolver.(ts|tsx|js|jsx)',
})

// Initial auto-loading
for await (const [path, module] of autoloader.autoload()) {
  server.resolvers.set(path, module)
}

// Starts the server with the initial GraphQL resolvers
await server.start()

// In development start watching for changes
if (isDevelopment) {
  autoloader.hooks.add('loaded', (path, module) => {
    server.resolvers.set(path, module)
    server.reload()
  })

  autoloader.hooks.add('unlink', (path, module) => {
    server.resolvers.delete(path)
    server.reload()
  })

  await autoload.watch()
}
```

### `Autoloader.autoload()`

The `autoload()` method loads discovered modules that matches the provided glob pattern.
Additionally, if [hot-hook](https://github.com/Julien-R44/hot-hook) has been initialized it listens for module disposal and reload it.

```ts
import { Autoloader } from '@foadonis/autoloader'

const autoloader = new Autoloader({
  path: new URL('app/controllers', app.appRoot),
  glob: '*_controller.(js|ts|jsx|tsx)',
})

for await (const [path, module] of autoloader.autoload()) {
  // Loaded module
}

autoloader.hooks.add('loaded', (path: string, module: any) => {
  // A module has been reloaded
})
```

### `Autoloader.watch()`

The `watch()` method watches for added and removed files. Added files are automatically `loaded` and plugged to [hot-hook](https://github.com/Julien-R44/hot-hook) if available.

Note that the watcher does not autoload modules that are part of the initial scan (see `Autoloader.autoload()`). In most cases you want to first run `autoload()` and then start the watcher.

```ts
import { Autoloader } from '@foadonis/autoloader'

const autoloader = new Autoloader({
  path: new URL('app/controllers', app.appRoot),
  glob: '*_controller.(js|ts|jsx|tsx)',
})

autoloader.hooks.add('loaded', (path: string, module: any) => {
  // module has been loaded (added or reloaded)
})

autoloader.hooks.add('unlink', (path: string) => {
  // unload the module from router
})

await autoloader.watch()
```

## License

[MIT licensed](LICENSE.md).
