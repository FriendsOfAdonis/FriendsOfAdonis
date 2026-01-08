import { test } from '@japa/runner'
import { createApplication } from './helpers.ts'
import Configure from '@adonisjs/core/commands/configure'

test.group('Configure', () => {
  test('should configure crypt', async ({ fs, assert }) => {
    const { ace } = await createApplication()

    await fs.create('.env', '')
    await fs.createJson('tsconfig.json', {})
    await fs.createJson('package.json', {})
    await fs.create('start/env.ts', `export default Env.create(new URL('./'), {})`)
    await fs.create('adonisrc.ts', `export default defineConfig({})`)

    const command = await ace.create(Configure, ['../../index.js'])

    await command.exec()
    command.assertSucceeded()

    await assert.fileExists('adonisrc.ts')
    await assert.fileContains('adonisrc.ts', '@foadonis/crypt/commands')
    await assert.fileContains('start/env.ts', '@foadonis/crypt/register')
  })
})
