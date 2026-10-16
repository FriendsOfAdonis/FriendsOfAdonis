import { type Algoliasearch } from 'algoliasearch'
import { type MeiliSearch } from 'meilisearch'
import { test } from '@japa/runner'
import { type Client } from 'typesense'

import { MeilisearchEngine } from '../../src/engines/meilisearch.js'
import { TypesenseEngine } from '../../src/engines/typesense.js'
import { MagnifyManager } from '../../src/magnify_manager.js'
import { AlgoliaEngine } from '../../src/engines/algolia.js'

test.group('Magnify manager', () => {
  test('create engine instance from the manager', ({ assert, expectTypeOf }) => {
    const manager = new MagnifyManager({
      default: 'meilisearch',
      engines: {
        meilisearch: () =>
          new MeilisearchEngine({
            host: 'http://localhost',
          }),
        algolia: () =>
          new AlgoliaEngine({
            apiKey: 'TESTEST',
            appId: 'TESTEST',
          }),
        typesense: () =>
          new TypesenseEngine({
            nodes: [{ url: 'http://localhost' }],
            collectionSettings: {},
            apiKey: '',
          }),
      },
    })

    expectTypeOf(manager.engine)
      .parameter(0)
      .toEqualTypeOf<'meilisearch' | 'typesense' | 'algolia' | undefined>()

    expectTypeOf(manager.engine('meilisearch')).toEqualTypeOf<MeilisearchEngine>()
    expectTypeOf(manager.engine('algolia')).toEqualTypeOf<AlgoliaEngine>()
    expectTypeOf(manager.engine('typesense')).toEqualTypeOf<TypesenseEngine>()

    assert.instanceOf(manager.engine('meilisearch'), MeilisearchEngine)
    assert.instanceOf(manager.engine('algolia'), AlgoliaEngine)
    assert.instanceOf(manager.engine('typesense'), TypesenseEngine)
  })

  test('get the client from an engine', ({ expectTypeOf }) => {
    const manager = new MagnifyManager({
      default: 'meilisearch',
      engines: {
        meilisearch: () =>
          new MeilisearchEngine({
            host: 'http://localhost',
          }),
        algolia: () =>
          new AlgoliaEngine({
            apiKey: 'TESTEST',
            appId: 'TESTEST',
          }),
        typesense: () =>
          new TypesenseEngine({
            nodes: [{ url: 'http://localhost' }],
            collectionSettings: {},
            apiKey: '',
          }),
      },
    })

    expectTypeOf(manager.engine('meilisearch').client).toEqualTypeOf<MeiliSearch>()
    expectTypeOf(manager.engine('algolia').client).toEqualTypeOf<Algoliasearch>()
    expectTypeOf(manager.engine('typesense').client).toEqualTypeOf<Client>()
  })
})
