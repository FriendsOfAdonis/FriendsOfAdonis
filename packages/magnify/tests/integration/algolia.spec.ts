import { test } from '@japa/runner'
import User from '../fixtures/user.js'
import { AlgoliaEngine } from '../../src/engines/algolia.js'
import env from '../env.js'
import {
  assertSearchResults,
  BASE_URL,
  initializeDatabase,
  setupFakeAdonisApp,
  sleep,
} from '../helpers.js'
import { defineConfig as defineMagnifyConfig } from '../../src/define_config.js'
import { ApplicationService } from '@adonisjs/core/types'
import { Kernel } from '@adonisjs/core/ace'
import Import from '../../commands/import.js'
import Flush from '../../commands/flush.js'
import { FileSystem } from '@japa/file-system'
import { fileURLToPath } from 'node:url'

test.group('Algolia', async (group) => {
  let ctx: { app: ApplicationService; ace: Kernel }

  group.tap((t) => t.timeout(20_000))
  group.setup(async () => {
    const fs = new FileSystem(fileURLToPath(BASE_URL))
    ctx = await setupFakeAdonisApp(fs, {
      magnify: defineMagnifyConfig({
        default: 'algolia',
        engines: {
          algolia: () =>
            new AlgoliaEngine({
              appId: env.get('ALGOLIA_APP_ID'),
              apiKey: env.get('ALGOLIA_API_KEY'),
            }),
        },
      }),
    })

    await initializeDatabase(ctx.ace)

    const importCommand = await ctx.ace.create(Import, ['../fixtures/user.ts'])
    await importCommand.exec()
    await sleep(4)
  })

  group.teardown(() => ctx.app.terminate())

  test('can use basic search', async ({ assert }) => {
    const results = await User.search('lar').latest().take(10).get()

    assertSearchResults(assert, results, [
      [1, 'Adonis Larpor'],
      [11, 'Larry Casper'],
      [12, 'Reta Larkin'],
      [20, 'Prof. Larry Prosacco DVM'],
      [39, 'Linkwood Larkin'],
      [40, 'Otis Larson MD'],
      [41, 'Gudrun Larkin'],
      [42, 'Dax Larkin'],
      [43, 'Dana Larson Sr.'],
      [44, 'Amos Larson Sr.'],
    ])
  })

  test('can search with where', async ({ assert }) => {
    const results = await User.search('lar').latest().where('isAdmin', true).take(10).get()

    assertSearchResults(assert, results, [
      [11, 'Larry Casper'],
      [20, 'Prof. Larry Prosacco DVM'],
      [39, 'Linkwood Larkin'],
    ])
  })

  test('can use paginated search', async ({ assert }) => {
    const [page1, page2] = [
      await User.search('lar').take(10).latest().paginate(5, 1),
      await User.search('lar').take(10).latest().paginate(5, 2),
    ]

    assertSearchResults(
      assert,
      [...page1.values()],
      [
        [11, 'Larry Casper'],
        [41, 'Gudrun Larkin'],
        [42, 'Dax Larkin'],
        [43, 'Dana Larson Sr.'],
        [44, 'Amos Larson Sr.'],
      ]
    )

    assertSearchResults(
      assert,
      [...page2.values()],
      [
        [1, 'Adonis Larpor'],
        [12, 'Reta Larkin'],
        [20, 'Prof. Larry Prosacco DVM'],
        [39, 'Linkwood Larkin'],
        [40, 'Otis Larson MD'],
      ]
    )
  })

  test('document is removed when model is removed', async ({ assert }) => {
    let results = await User.search('Gudrun Larkin').take(1).get()
    let result = results[0]

    assert.equal(result.name, 'Gudrun Larkin')

    await result.delete()

    results = await User.search('Gudrun Larkin').take(1).get()
    result = results[0]

    assert.isUndefined(result)
  })

  test('document is updated when model is updated', async ({ assert }) => {
    let results = await User.search('Dax Larkin').take(1).get()
    let result = results[0]

    assert.equal(result.name, 'Dax Larkin')

    result.name = 'Dax Larkin Updated'
    await result.save()

    await sleep(5)

    results = await User.search('Dax Larkin Updated').take(1).get()
    result = results[0]

    assert.equal(result.name, 'Dax Larkin Updated')
  }).skip(false, 'Algolia seems to take a lot of time updating records')

  test('document is added when model is created', async ({ assert }) => {
    let results = await User.search('New User').take(1).get()
    let result = results[0]

    assert.isUndefined(result)

    await User.create({
      name: 'New User',
    })

    await sleep(6)

    results = await User.search('New User').take(1).get()
    result = results[0]

    assert.equal(result.name, 'New User')
  })

  test('flush properly remove all documents', async ({ assert }) => {
    const command = await ctx.ace.create(Flush, ['../fixtures/user.js'])
    await command.exec()
    command.assertSucceeded()

    // We wait for the documents to be successfully flushed by the engine
    await sleep(6)

    const results = await User.search('').get()
    assert.lengthOf(results, 0)
  })
})
