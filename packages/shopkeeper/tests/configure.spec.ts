import Configure from '@adonisjs/core/commands/configure'
import { test } from '@japa/runner'
import { createApp } from './app.js'

test.group('Configure', () => {
  test('create migration files', async ({ assert, fs }) => {
    await fs.remove('database/migrations')
    const { ace } = await createApp()

    await fs.create('.env', '')
    await fs.createJson('tsconfig.json', {})
    await fs.create('start/env.ts', `export default Env.create(new URL('./'), {})`)
    await fs.create('adonisrc.ts', `export default defineConfig({})`)

    const command = await ace.create(Configure, ['../../index.js'])
    await command.exec()

    await assert.fileExists('config/shopkeeper.ts')
    await assert.fileContains('config/shopkeeper.ts', 'defineConfig')

    await assert.fileExists('adonisrc.ts')
    await assert.fileContains('adonisrc.ts', '@foadonis/shopkeeper/commands')
    await assert.fileContains('adonisrc.ts', '@foadonis/shopkeeper/shopkeeper_provider')

    const files = await fs.readDir('database/migrations')

    assert.lengthOf(files, 4)
  })
})
