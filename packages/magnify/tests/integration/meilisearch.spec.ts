import { test } from '@japa/runner'
import { StartedTestContainer } from 'testcontainers'
import SyncIndexSettings from '../../commands/sync_index_settings.js'
import { MeilisearchEngine } from '../../src/engines/meilisearch.js'
import User from '../fixtures/user.js'
import Import from '../../commands/import.js'
import Flush from '../../commands/flush.js'
import { ApplicationService } from '@adonisjs/core/types'
import { Kernel } from '@adonisjs/core/ace'
import {
  assertSearchResults,
  CONTAINERS,
  initializeDatabase,
  setupFakeAdonisApp,
  sleep,
} from '../helpers.js'
import { defineConfig as defineMagnifyConfig } from '../../src/define_config.js'

test.group('Meilisearch', async (group) => {
  let container: StartedTestContainer
  let ctx: { app: ApplicationService; ace: Kernel }

  group.tap((t) => t.timeout(20_000))
  group.each.setup(async ({ context }) => {
    container = await CONTAINERS.meilisearch.start()
    ctx = await setupFakeAdonisApp(context.fs, {
      magnify: defineMagnifyConfig({
        default: 'meilisearch',
        engines: {
          meilisearch: () =>
            new MeilisearchEngine({
              host: `http://${container.getHost()}:${container.getFirstMappedPort()}`,
              indexSettings: {
                users: {
                  filterableAttributes: ['isAdmin'],
                  sortableAttributes: ['createdAt'],
                },
              },
            }),
        },
      }),
    })

    await initializeDatabase(ctx.ace)

    const syncCommand = await ctx.ace.create(SyncIndexSettings, [])
    await syncCommand.exec()

    const importCommand = await ctx.ace.create(Import, ['../fixtures/user.ts'])
    await importCommand.exec()
    await sleep(2)
  })

  group.each.teardown(async () => {
    await ctx.app.terminate()
    await container.stop()
  })

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
        [1, 'Adonis Larpor'],
        [11, 'Larry Casper'],
        [12, 'Reta Larkin'],
        [39, 'Linkwood Larkin'],
        [40, 'Otis Larson MD'],
      ]
    )

    assertSearchResults(
      assert,
      [...page2.values()],
      [
        [20, 'Prof. Larry Prosacco DVM'],
        [41, 'Gudrun Larkin'],
        [42, 'Dax Larkin'],
        [43, 'Dana Larson Sr.'],
        [44, 'Amos Larson Sr.'],
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

    results = await User.search('Dax Larkin Updated').take(1).get()
    result = results[0]

    assert.equal(result.name, 'Dax Larkin Updated')
  })

  test('document is added when model is created', async ({ assert }) => {
    let results = await User.search('New User').take(1).get()
    let result = results[0]

    assert.isUndefined(result)

    await User.create({
      name: 'New User',
    })

    await sleep(2)

    results = await User.search('New User').take(1).get()
    result = results[0]

    assert.equal(result.name, 'New User')
  }).timeout(10000)

  test('flush properly remove all documents', async ({ assert }) => {
    const command = await ctx.ace.create(Flush, ['../fixtures/user.js'])
    await command.exec()
    command.assertSucceeded()

    // We wait for the documents to be successfully flushed by the engine
    await sleep(2)

    const results = await User.search('').get()
    assert.lengthOf(results, 0)
  }).timeout(10000)
})
