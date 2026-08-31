import Configure from '@adonisjs/core/commands/configure'
import { IgnitorFactory } from '@adonisjs/core/factories'
import { test } from '@japa/runner'
import { BASE_URL } from './helpers.ts'

test.group('Configure', () => {
  test('register the provider, publish the config and the migrations', async ({ fs, assert }) => {
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
    await fs.create('start/env.ts', `export default Env.create(new URL('./'), {})`)
    await fs.create('adonisrc.ts', `export default defineConfig({})`)

    const ace = await app.container.make('ace')
    const command = await ace.create(Configure, ['../../index.ts'])
    await command.exec()
    command.assertSucceeded()

    await assert.fileContains('adonisrc.ts', '@foadonis/sentinel/sentinel_provider')
    await assert.fileContains('config/sentinel.ts', 'defineConfig')
    await assert.fileContains('config/sentinel.ts', 'tokens.lucid(')

    /**
     * One migration per table, prefixed with a timestamp
     */
    const migrations = (await fs.readDir('database/migrations'))
      .map((entry) => entry.basename)
      .sort()

    assert.lengthOf(migrations, 2)
    assert.match(migrations[0], /^\d+_create_sentinel_tokens_table\.ts$/)
    assert.match(migrations[1], /^\d+_create_totp_authenticators_table\.ts$/)

    const tokens = `database/migrations/${migrations[0]}`
    await assert.fileContains(tokens, "from '@foadonis/sentinel/token'")
    await assert.fileContains(tokens, 'TokenSchema.configureTokensTable(table)')

    const authenticators = `database/migrations/${migrations[1]}`
    await assert.fileContains(authenticators, "from '@foadonis/sentinel/totp'")
    await assert.fileContains(authenticators, 'TOTPSchema.configureAuthenticatorsTable(table)')
  }).timeout(30000)
})
