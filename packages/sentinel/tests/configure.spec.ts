import Configure from '@adonisjs/core/commands/configure'
import { test } from '@japa/runner'
import { createApp } from './helpers.ts'

test.group('Configure', () => {
  test('should configure sentinel', async ({ fs, assert }) => {
    const app = await createApp()

    await fs.create('.env', '')
    await fs.createJson('tsconfig.json', {})
    await fs.createJson('package.json', {})
    await fs.create('start/env.ts', `export default Env.create(new URL('./'), {})`)
    await fs.create('adonisrc.ts', `export default defineConfig({})`)

    const ace = await app.container.make('ace')

    const command = await ace.create(Configure, ['../../index.js'])
    await command.exec()

    command.assertSucceeded()

    await assert.fileExists('config/sentinel.ts')
    await assert.fileContains('config/sentinel.ts', 'defineConfig')
    await assert.fileContains('config/sentinel.ts', 'tokens.lucid')

    await assert.fileExists('adonisrc.ts')
    await assert.fileContains('adonisrc.ts', '@foadonis/sentinel/sentinel_provider')
  }).timeout(30000)
})
