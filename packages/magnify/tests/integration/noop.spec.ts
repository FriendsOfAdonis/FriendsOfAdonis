import { test } from '@japa/runner'
import { type ApplicationService } from '@adonisjs/core/types'
import { type Kernel } from '@adonisjs/core/ace'
import { FileSystem } from '@japa/file-system'
import { fileURLToPath } from 'node:url'
import Flush from '../../commands/flush.js'
import Import from '../../commands/import.js'
import { NoopEngine } from '../../src/engines/noop.js'
import { defineConfig as defineMagnifyConfig } from '../../src/define_config.js'
import User from '../fixtures/user.js'
import { BASE_URL, initializeDatabase, setupFakeAdonisApp } from '../helpers.js'

test.group('Noop', (group) => {
  let ctx: { app: ApplicationService; ace: Kernel }

  group.tap((t) => t.timeout(20_000))
  group.setup(async () => {
    const fs = new FileSystem(fileURLToPath(BASE_URL))
    ctx = await setupFakeAdonisApp(fs, {
      magnify: defineMagnifyConfig({
        default: 'noop',
        engines: {
          noop: () => new NoopEngine(),
        },
      }),
    })

    await initializeDatabase(ctx.ace)
  })

  group.teardown(() => ctx.app.terminate())

  test('search always returns no hits', async ({ assert }) => {
    const results = await User.search('lar').latest().take(10).get()

    assert.deepEqual(results, [])
  })

  test('filtered search always returns no hits', async ({ assert }) => {
    const results = await User.search('lar').where('isAdmin', true).get()

    assert.deepEqual(results, [])
  })

  test('paginated search always returns an empty page', async ({ assert }) => {
    const page = await User.search('lar').latest().paginate(5, 1)

    assert.equal(page.total, 0)
    assert.equal(page.perPage, 5)
    assert.equal(page.currentPage, 1)
    assert.isTrue(page.isEmpty)
    assert.deepEqual([...page.values()], [])
  })

  test('creating a model does not produce search hits', async ({ assert }) => {
    await User.create({ name: 'New User' })

    assert.deepEqual(await User.search('New User').get(), [])
  })

  test('import and flush succeed without changing search results', async ({ assert }) => {
    const importCommand = await ctx.ace.create(Import, ['../fixtures/user.ts'])
    await importCommand.exec()
    importCommand.assertSucceeded()

    assert.deepEqual(await User.search('lar').get(), [])

    const flushCommand = await ctx.ace.create(Flush, ['../fixtures/user.js'])
    await flushCommand.exec()
    flushCommand.assertSucceeded()

    assert.deepEqual(await User.search('').get(), [])
  })
})
