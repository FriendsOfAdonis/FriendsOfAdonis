import { test } from '@japa/runner'
import { type ApplicationService } from '@adonisjs/core/types'
import { type Kernel } from '@adonisjs/core/ace'
import Flush from '../../commands/flush.js'
import { defineConfig as defineMagnifyConfig } from '../../src/define_config.js'
import User from '../fixtures/user.js'
import { assertSearchResults, initializeDatabase, setupFakeAdonisApp } from '../helpers.js'
import { LucidEngine } from '../../src/engines/lucid.ts';

test.group('Lucid', (group) => {
  let ctx: { app: ApplicationService; ace: Kernel }

  group.tap((t) => t.timeout(20_000))
  group.each.setup(async ({ context }) => {
    ctx = await setupFakeAdonisApp(context.fs, {
      magnify: defineMagnifyConfig({
        default: 'lucid',
        engines: {
          lucid: () => new LucidEngine(),
        },
      }),
    })

    await initializeDatabase(ctx.ace)
  })

  group.each.teardown(async () => {
    await ctx.app.terminate()
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

  test('search is case insensitive', async ({ assert }) => {
    const results = await User.search('LAR').latest().take(10).get()

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

  test('can search with whereIn', async ({ assert }) => {
    const results = await User.search('lar').latest().whereIn('id', [11, 20, 99]).get()

    assertSearchResults(assert, results, [
      [11, 'Larry Casper'],
      [20, 'Prof. Larry Prosacco DVM'],
    ])
  })

  test('can search with whereNotIn', async ({ assert }) => {
    const results = await User.search('lar').latest().whereNotIn('id', [1, 11]).take(3).get()

    assertSearchResults(assert, results, [
      [12, 'Reta Larkin'],
      [20, 'Prof. Larry Prosacco DVM'],
      [39, 'Linkwood Larkin'],
    ])
  })

  test('can use paginated search', async ({ assert }) => {
    const [page1, page2] = [
      await User.search('lar').latest().paginate(5, 1),
      await User.search('lar').latest().paginate(5, 2),
    ]

    assert.equal(page1.total, 10)
    assert.equal(page1.perPage, 5)
    assert.equal(page1.currentPage, 1)
    assert.isTrue(page1.hasMorePages)

    assert.equal(page2.total, 10)
    assert.equal(page2.currentPage, 2)
    assert.isFalse(page2.hasMorePages)

    assertSearchResults(
      assert,
      [...page1.values()],
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
      [...page2.values()],
      [
        [40, 'Otis Larson MD'],
        [41, 'Gudrun Larkin'],
        [42, 'Dax Larkin'],
        [43, 'Dana Larson Sr.'],
        [44, 'Amos Larson Sr.'],
      ]
    )
  })

  test('empty query does not apply a text constraint', async ({ assert }) => {
    const results = await User.search('').where('isAdmin', true).latest().get()

    assertSearchResults(assert, results, [
      [11, 'Larry Casper'],
      [20, 'Prof. Larry Prosacco DVM'],
      [39, 'Linkwood Larkin'],
    ])
  })

  test('can order from oldest to newest', async ({ assert }) => {
    const results = await User.search('lar').oldest().take(3).get()

    assertSearchResults(assert, results, [
      [44, 'Amos Larson Sr.'],
      [43, 'Dana Larson Sr.'],
      [42, 'Dax Larkin'],
    ])
  })

  test('take limits the number of results', async ({ assert }) => {
    const results = await User.search('lar').latest().take(3).get()

    assertSearchResults(assert, results, [
      [1, 'Adonis Larpor'],
      [11, 'Larry Casper'],
      [12, 'Reta Larkin'],
    ])
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

    results = await User.search('New User').take(1).get()
    result = results[0]

    assert.equal(result.name, 'New User')
  })

  test('flush is a no-op and keeps database rows searchable', async ({ assert }) => {
    const command = await ctx.ace.create(Flush, ['../fixtures/user.js'])
    await command.exec()
    command.assertSucceeded()

    const results = await User.search('lar').latest().take(10).get()
    assert.lengthOf(results, 10)
  })
})
