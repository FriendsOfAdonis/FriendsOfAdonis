import { test } from '@japa/runner'
import { createApplication } from '../helpers.ts'
import InitCommand from '../../commands/init_command.ts'

test.group('InitCommand', () => {
  test('should initialize public and private keys', async ({ assert, fs }) => {
    const { ace } = await createApplication()

    await fs.create('adonisrc.ts', `export default defineConfig({})`)

    const command = await ace.create(InitCommand, ['../../index.js'])

    await command.exec()
    command.assertSucceeded()

    await assert.fileExists('.env')
    await assert.fileContains('.env', 'CRYPT_PUBLIC_KEY')

    await assert.fileExists('.env.keys')
    await assert.fileContains('.env.keys', 'CRYPT_PRIVATE_KEY')
  })

  test('should initialize public and private keys based on NODE_ENV', async ({ assert, fs }) => {
    const { ace } = await createApplication()

    await fs.create('adonisrc.ts', `export default defineConfig({})`)

    const command = await ace.create(InitCommand, ['../../index.js', '-e', 'production'])

    await command.exec()
    command.assertSucceeded()

    await assert.fileExists('.env.production')
    await assert.fileContains('.env.production', 'CRYPT_PUBLIC_KEY_PRODUCTION')

    await assert.fileExists('.env.keys')
    await assert.fileContains('.env.keys', 'CRYPT_PRIVATE_KEY_PRODUCTION')
  })
})
