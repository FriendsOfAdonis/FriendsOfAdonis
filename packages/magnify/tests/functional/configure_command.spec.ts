import { test } from '@japa/runner'
import { setupApp, setupFakeAdonisProject } from '../helpers.js'
import ConfigureCommand from '../../commands/configure.js'

test.group('ConfigureCommand', (group) => {
  group.tap((t) => t.timeout(20_000))
  group.each.setup(({ context }) => setupFakeAdonisProject(context.fs))
  group.each.teardown(({ context }) => context.fs.cleanup())

  test('algolia', async ({ assert }) => {
    const { ace } = await setupApp()

    ace.prompt.trap('engine').replyWith('Algolia')
    ace.prompt.trap('ALGOLIA_APP_ID').replyWith('<app-id>')
    ace.prompt.trap('ALGOLIA_API_KEY').replyWith('<api-key>')
    ace.prompt.trap('install').reject()

    const command = await ace.create(ConfigureCommand, [])
    await command.exec()

    await assert.fileContains('start/env.ts', 'ALGOLIA_APP_ID')
    await assert.fileContains('start/env.ts', 'ALGOLIA_API_KEY')
    await assert.fileContains('.env', '<app-id>')
    await assert.fileContains('.env', '<api-key>')
  })

  test('meilisearch', async ({ assert }) => {
    const { ace } = await setupApp()

    ace.prompt.trap('engine').replyWith('Meilisearch')
    ace.prompt.trap('MEILISEARCH_HOST').replyWith('<host>')
    ace.prompt.trap('MEILISEARCH_API_KEY').replyWith('<key>')
    ace.prompt.trap('install').reject()

    const command = await ace.create(ConfigureCommand, [])
    await command.exec()

    await assert.fileContains('start/env.ts', 'MEILISEARCH_HOST')
    await assert.fileContains('start/env.ts', 'MEILISEARCH_API_KEY')
    await assert.fileContains('.env', '<host>')
    await assert.fileContains('.env', '<key>')
  })

  test('typesense', async ({ assert }) => {
    const { ace } = await setupApp()

    ace.prompt.trap('engine').replyWith('Typesense')
    ace.prompt.trap('TYPESENSE_NODE_URL').replyWith('<host>')
    ace.prompt.trap('TYPESENSE_API_KEY').replyWith('<api-key>')
    ace.prompt.trap('install').reject()

    const command = await ace.create(ConfigureCommand, [])
    await command.exec()

    await assert.fileContains('start/env.ts', 'TYPESENSE_NODE_URL')
    await assert.fileContains('start/env.ts', 'TYPESENSE_API_KEY')
    await assert.fileContains('.env', '<host>')
    await assert.fileContains('.env', '<api-key>')
  })
})
