<div align="center">
<br/>

## @foadonis/magnify

### Plug and play full-text search for your Adonis application

<br/>
</div>

<div align="center">

<!-- automd:badges color="brightgreen" license name="@foadonis/openapi" bundlephobia packagephobia -->

[![npm version](https://img.shields.io/npm/v/@foadonis/openapi?color=brightgreen)](https://npmjs.com/package/@foadonis/openapi)
[![npm downloads](https://img.shields.io/npm/dm/@foadonis/openapi?color=brightgreen)](https://npm.chart.dev/@foadonis/openapi)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@foadonis/openapi?color=brightgreen)](https://bundlephobia.com/package/@foadonis/openapi)

<!-- /automd -->

<!-- automd:coverage -->

![Coverage](https://img.shields.io/badge/coverage-81%25-brightgreen)

<!-- /automd -->

</div>

## Description

Magnify provides a simple, driver based solution for adding full-text search to your Lucid models. Using Lucid hooks, Magnify automatically keep your search indexes in sync with your database.

Currently, Magnify ships with [Algolia](https://algolia.com), [Meilisearch](https://www.meilisearch.com/) and [Typesense](https://typesense.org/) engines. Furthermore, writing custom engines is simple and you are free to extend Magnify with your own search implementations.

```ts title="app/models/post.ts"
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { Searchable } from '@foadonis/magnify'

export default class Post extends compose(BaseModel, Searchable) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string
}
```

```ts
import Post from '#models/post'

const posts = await Post.search('Adonis').take(10).get()
```

## Quickstart

[Installation & Getting Started](https://friendsofadonis.github.io/docs/magnify/getting-started)

## License

[MIT licensed](LICENSE.md).
