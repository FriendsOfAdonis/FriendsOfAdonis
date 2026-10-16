import { test } from '@japa/runner'
import { createApplication } from '../helpers.ts'
import { keypair } from '../../src/utils/keypair.ts'
import { CryptPublicKey } from '../../src/public_key.ts'
import DecryptCommand from '../../commands/decrypt_command.ts'

test.group('DecryptCommand', () => {
  test('should decrypt using private key', async ({ fs }) => {
    const { ace } = await createApplication()

    const pair = keypair()
    const publicKey = new CryptPublicKey('CRYPT_PUBLIC_KEY', pair.publicKey)

    await fs.create('adonisrc.ts', `export default defineConfig({})`)
    await fs.create('.env', `TEST_KEY="encrypted:${publicKey.encrypt('TEST_VALUE')}"`)
    await fs.create('.env.keys', `CRYPT_PRIVATE_KEY="${pair.privateKey}"`)

    const command = await ace.create(DecryptCommand, ['TEST_KEY'])

    await command.exec()
    command.assertSucceeded()
  })

  test('should decrypt using private key with NODE_ENV', async ({ fs }) => {
    const { ace } = await createApplication()

    const pair = keypair()
    const publicKey = new CryptPublicKey('CRYPT_PUBLIC_KEY', pair.publicKey)

    await fs.create('adonisrc.ts', `export default defineConfig({})`)
    await fs.create('.env.production', `TEST_KEY="encrypted:${publicKey.encrypt('TEST_VALUE')}"`)
    await fs.create('.env.keys', `CRYPT_PRIVATE_KEY_PRODUCTION="${pair.privateKey}"`)

    const command = await ace.create(DecryptCommand, ['TEST_KEY', '-e', 'production'])

    await command.exec()
    command.assertSucceeded()
  })
})
