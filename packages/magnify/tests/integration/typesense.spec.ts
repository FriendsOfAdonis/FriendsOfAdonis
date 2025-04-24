import { test } from '@japa/runner'
import { TypesenseEngine } from '../../src/engines/typesense.js'
import { StartedTestContainer } from 'testcontainers'
import User from '../fixtures/user.js'
import Import from '../../commands/import.js'
import Flush from '../../commands/flush.js'
import {
  assertSearchResults,
  BASE_URL,
  CONTAINERS,
  initializeDatabase,
  setupFakeAdonisApp,
  sleep,
} from '../helpers.js'
import { ApplicationService } from '@adonisjs/core/types'
import { Kernel } from '@adonisjs/core/ace'
import { defineConfig as defineMagnifyConfig } from '../../src/define_config.js'
import { FileSystem } from '@japa/file-system'
import { fileURLToPath } from 'node:url'

test.group('Typesense', (group) => {
  let container: StartedTestContainer
  let ctx: { app: ApplicationService; ace: Kernel }
  const fs = new FileSystem(fileURLToPath(BASE_URL))

  group.tap((t) => t.timeout(20_000))
  group.setup(async () => {
    container = await CONTAINERS.typesense.start()
    const engine = new TypesenseEngine({
      apiKey: 'superrandomkey',
      nodes: [{ url: `http://${container.getHost()}:${container.getFirstMappedPort()}` }],
      collectionSettings: {
        users: {
          queryBy: ['name'],
          fields: [
            {
              name: 'name',
              type: 'string',
            },
            {
              name: 'isAdmin',
              type: 'bool',
              optional: true,
            },
            {
              name: 'updatedAt',
              type: 'string',
            },
            {
              name: 'createdAt',
              type: 'int32',
            },
          ],
        },
      },
    })

    ctx = await setupFakeAdonisApp(fs, {
      magnify: defineMagnifyConfig({
        default: 'typesense',
        engines: {
          typesense: () => engine,
        },
      }),
    })

    await sleep(4)
    await initializeDatabase(ctx.ace)

    await engine.syncIndexSettings()

    const importCommand = await ctx.ace.create(Import, ['../fixtures/user.ts'])
    await importCommand.exec()
    importCommand.assertSucceeded()

    await sleep(3)
  })

  group.teardown(async () => {
    await ctx.app.terminate()
    await container.stop()
    await fs.cleanup()
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
      [...page2.values()],
      [
        [1, 'Adonis Larpor'],
        [11, 'Larry Casper'],
        [12, 'Reta Larkin'],
        [20, 'Prof. Larry Prosacco DVM'],
        [39, 'Linkwood Larkin'],
      ]
    )

    assertSearchResults(
      assert,
      [...page1.values()],
      [
        [40, 'Otis Larson MD'],
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
  }).skip(true, 'Typesense seems to take a lot of time removing a record')

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
  })

  test('flush properly remove all documents', async ({ assert }) => {
    const command = await ctx.ace.create(Flush, ['../fixtures/user.js'])
    await command.exec()
    command.assertSucceeded()

    // We wait for the documents to be successfully flushed by the engine
    await sleep(2)

    const results = await User.search('').get()
    assert.lengthOf(results, 0)
  })
})
