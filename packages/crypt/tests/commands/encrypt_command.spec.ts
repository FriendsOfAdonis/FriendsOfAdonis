import { test } from '@japa/runner'
import { createApplication } from '../helpers.ts'
import EncryptCommand from '../../commands/encrypt_command.ts'
import { keypair } from '../../src/utils/keypair.ts'

test.group('EncryptCommand', () => {
  test('should encrypt using public key', async ({ assert, fs }) => {
    const { ace } = await createApplication()

    const pair = keypair()

    await fs.create('adonisrc.ts', `export default defineConfig({})`)
    await fs.create('.env', `CRYPT_PUBLIC_KEY=${pair.publicKey}`)

    const command = await ace.create(EncryptCommand, ['TEST_KEY', 'TEST_VALUE'])

    await command.exec()
    command.assertSucceeded()

    await assert.fileExists('.env')
    await assert.fileContains('.env', 'CRYPT_PUBLIC_KEY')
    await assert.fileContains('.env', 'TEST_KEY="encrypted:')
  })

  test('should encrypt using public key with NODE_ENV', async ({ assert, fs }) => {
    const { ace } = await createApplication()

    const pair = keypair()

    await fs.create('adonisrc.ts', `export default defineConfig({})`)
    await fs.create('.env.production', `CRYPT_PUBLIC_KEY=${pair.publicKey}`)

    const command = await ace.create(EncryptCommand, ['TEST_KEY', 'TEST_VALUE', '-e', 'production'])

    await command.exec()
    command.assertSucceeded()

    await assert.fileExists('.env.production')
    await assert.fileContains('.env.production', 'CRYPT_PUBLIC_KEY')
    await assert.fileContains('.env.production', 'TEST_KEY="encrypted')
  })
})
