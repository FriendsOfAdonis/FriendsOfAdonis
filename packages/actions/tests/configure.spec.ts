import Configure from '@adonisjs/core/commands/configure'
import { IgnitorFactory } from '@adonisjs/core/factories'
import { test } from '@japa/runner'
import { BASE_URL } from './helpers.ts'

test.group('Configure', () => {
  test('configures @foadonis/actions in a fresh app', async ({ fs, assert }) => {
    const ignitor = new IgnitorFactory()
      .withCoreProviders()
      .withCoreConfig()
      .create(BASE_URL, {
        importer: (filePath) => {
          if (filePath.startsWith('./') || filePath.startsWith('../')) {
            return import(new URL(filePath, BASE_URL).href)
          }
          return import(filePath)
        },
      })

    const app = ignitor.createApp('console')
    await app.init()
    await app.boot()

    await fs.create('.env', '')
    await fs.createJson('tsconfig.json', {})
    await fs.createJson('package.json', {})
    await fs.create('start/env.ts', `export default Env.create(new URL('./'), {})`)
    await fs.create('adonisrc.ts', `export default defineConfig({})`)

    const ace = await app.container.make('ace')

    const command = await ace.create(Configure, ['../../index.js'])
    await command.exec()

    command.assertSucceeded()

    await assert.fileExists('adonisrc.ts')
    await assert.fileContains('adonisrc.ts', '@foadonis/actions/actions_provider')
    await assert.fileContains('adonisrc.ts', '@foadonis/actions/commands')
    await assert.fileContains('adonisrc.ts', "import { indexActions } from '@foadonis/actions'")
    await assert.fileContains('adonisrc.ts', 'indexActions()')

    await assert.fileExists('package.json')
    await assert.fileContains('package.json', '#actions/*')
    await assert.fileContains('package.json', './app/actions/*.js')
  }).timeout(30000)
})
