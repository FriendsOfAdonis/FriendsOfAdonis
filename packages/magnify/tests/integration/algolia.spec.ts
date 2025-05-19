import { test } from '@japa/runner'
import { initializeDatabase } from './app.js'
import { sleep } from '../utils.js'
import app from '@adonisjs/core/services/app'
import User from '../fixtures/user.js'
import { AlgoliaEngine } from '../../src/engines/algolia.js'
import { assertSearchResults } from './utils.js'
import env from '../env.js'
import Import from '../../commands/import.js'
import Flush from '../../commands/flush.js'
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers'

test.group('MyGroup', async (group) => {
  let redis: StartedTestContainer
  group.setup(async () => {
    redis = await new GenericContainer('redis:5.0.3-alpine')
      .withExposedPorts(6379)
      .withWaitStrategy(Wait.forLogMessage('Ready to accept connections'))
      .start()
  })

  group.teardown(async () => {
    await redis.stop()
  })

  test('do your testing', () => {})
})

test.group('Algolia', async (group) => {
  group.setup(async () => {
    User.shouldBeSearchable = false

    const magnify = await app.container.make('magnify')
    magnify.config = {
      default: 'algolia',
      // @ts-ignore
      engines: {
        algolia: () =>
          new AlgoliaEngine({
            appId: env.get('ALGOLIA_APP_ID'),
            apiKey: env.get('ALGOLIA_API_KEY'),
          }),
      },
    }

    await initializeDatabase(app)

    User.shouldBeSearchable = true

    const ace = await app.container.make('ace')

    const importCommand = await ace.create(Import, ['../fixtures/user.ts'])
    await importCommand.exec()
    await sleep(4)
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

  // WARN: Algolia seems to take a lot of time updating records
  // test('document is updated when model is updated', async ({ assert }) => {
  //   let results = await User.search('Dax Larkin').take(1).get()
  //   let result = results[0]
  //
  //   assert.equal(result.name, 'Dax Larkin')
  //
  //   result.name = 'Dax Larkin Updated'
  //   await result.save()
  //
  //   await sleep(5)
  //
  //   results = await User.search('Dax Larkin Updated').take(1).get()
  //   result = results[0]
  //
  //   assert.equal(result.name, 'Dax Larkin Updated')
  // })

  test('document is added when model is created', async ({ assert }) => {
    let results = await User.search('New User').take(1).get()
    let result = results[0]

    assert.isUndefined(result)

    await User.create({
      name: 'New User',
    })

    await sleep(5)

    results = await User.search('New User').take(1).get()
    result = results[0]

    assert.equal(result.name, 'New User')
  }).timeout(10000)

  test('flush properly remove all documents', async ({ assert }) => {
    const ace = await app.container.make('ace')
    const command = await ace.create(Flush, ['../fixtures/user.js'])
    await command.exec()
    command.assertSucceeded()

    // We wait for the documents to be successfully flushed by the engine
    await sleep(5)

    const results = await User.search('').get()
    assert.lengthOf(results, 0)
  }).timeout(10000)
})
