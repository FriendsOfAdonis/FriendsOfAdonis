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

```ts
import { Autoloader } from '@foadonis/autoloader'

const autoloader = new Autoloader({
  cwd: app.appRoot,
  path: 'app/controllers',
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
