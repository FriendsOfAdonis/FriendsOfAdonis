import Configure from '@adonisjs/core/commands/configure'
import { test } from '@japa/runner'
import { setupApp, setupFakeAdonisProject } from '../helpers.js'

test.group('Configuration', (group) => {
  group.each.setup(({ context }) => setupFakeAdonisProject(context.fs))
  group.each.teardown(({ context }) => context.fs.cleanup())
  group.tap((t) => t.timeout(20_000))

  test('configure algolia engine', async ({ assert }) => {
    const { ace } = await setupApp()

    ace.prompt.trap('engine').replyWith('algolia')
    ace.prompt.trap('ALGOLIA_APP_ID').replyWith('<app-id>')
    ace.prompt.trap('ALGOLIA_API_KEY').replyWith('<api-key>')
    ace.prompt.trap('install').reject()

    const command = await ace.create(Configure, ['../../index.js'])
    await command.exec()

    command.assertSucceeded()

    await assert.fileExists('config/magnify.ts')
    await assert.fileContains('config/magnify.ts', 'defineConfig')
    await assert.fileContains('config/magnify.ts', 'algolia')

    await assert.fileExists('adonisrc.ts')
    await assert.fileContains('adonisrc.ts', '@foadonis/magnify/commands')
    await assert.fileContains('adonisrc.ts', '@foadonis/magnify/magnify_provider')

    await assert.fileContains('.env', 'ALGOLIA_APP_ID')
    await assert.fileContains('.env', 'ALGOLIA_API_KEY')
  })

  test('configure meilisearch engine', async ({ assert }) => {
    const { ace } = await setupApp()

    ace.prompt.trap('engine').replyWith('meilisearch')
    ace.prompt.trap('MEILISEARCH_HOST').replyWith('<host>')
    ace.prompt.trap('MEILISEARCH_API_KEY').replyWith('<api-key>')
    ace.prompt.trap('install').reject()

    const command = await ace.create(Configure, ['../../index.js'])
    await command.exec()

    command.assertSucceeded()
    await assert.fileExists('config/magnify.ts')
    await assert.fileContains('config/magnify.ts', 'defineConfig')
    await assert.fileContains('config/magnify.ts', 'meilisearch')

    await assert.fileExists('adonisrc.ts')
    await assert.fileContains('adonisrc.ts', '@foadonis/magnify/commands')
    await assert.fileContains('adonisrc.ts', '@foadonis/magnify/magnify_provider')

    await assert.fileContains('.env', 'MEILISEARCH_HOST')
  })

  test('configure typesense engine', async ({ assert }) => {
    const { ace } = await setupApp()

    ace.prompt.trap('engine').replyWith('typesense')
    ace.prompt.trap('TYPESENSE_NODE_URL').replyWith('<node-url>')
    ace.prompt.trap('TYPESENSE_API_KEY').replyWith('<api-key>')
    ace.prompt.trap('install').reject()

    const command = await ace.create(Configure, ['../../index.js'])
    await command.exec()

    command.assertSucceeded()
    await assert.fileExists('config/magnify.ts')
    await assert.fileContains('config/magnify.ts', 'defineConfig')
    await assert.fileContains('config/magnify.ts', 'typesense')

    await assert.fileExists('adonisrc.ts')
    await assert.fileContains('adonisrc.ts', '@foadonis/magnify/commands')
    await assert.fileContains('adonisrc.ts', '@foadonis/magnify/magnify_provider')

    await assert.fileContains('.env', 'TYPESENSE_API_KEY')
  })
})
