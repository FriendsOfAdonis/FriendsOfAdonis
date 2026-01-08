import { test } from '@japa/runner'
import { CryptPrivateKey } from '../src/private_key.ts'
import { keypair } from '../src/utils/keypair.ts'
import { CryptPublicKey } from '../src/public_key.ts'
import { encrypt } from '../src/utils/encrypt.ts'

test.group('CryptPrivateKey', (group) => {
  group.each.teardown(() => {
    delete process.env.NODE_ENV
    delete process.env.CRYPT_PRIVATE_KEY
    delete process.env.CRYPT_PRIVATE_KEY_PRODUCTION
  })

  test('should load from environment variable', async ({ assert, fs }) => {
    process.env.CRYPT_PRIVATE_KEY = 'helloworld'

    const privateKey = await CryptPrivateKey.load(fs.baseUrl)

    assert.equal(privateKey?.name, 'CRYPT_PRIVATE_KEY')
    assert.equal(privateKey?.value, 'helloworld')
  })

  test('should load from CRYPT_PRIVATE_KEY with NODE_ENV=production', async ({ assert, fs }) => {
    process.env.NODE_ENV = 'production'
    process.env.CRYPT_PRIVATE_KEY = 'helloworld'

    const privateKey = await CryptPrivateKey.load(fs.baseUrl)

    assert.equal(privateKey?.name, 'CRYPT_PRIVATE_KEY')
    assert.equal(privateKey?.value, 'helloworld')
  })

  test('should load from CRYPT_PRIVATE_KEY_PRODUCTION with NODE_ENV=production', async ({
    assert,
  }) => {
    process.env.NODE_ENV = 'production'
    process.env.CRYPT_PRIVATE_KEY_PRODUCTION = 'helloworld'

    const privateKey = await CryptPrivateKey.fromEnv()

    assert.equal(privateKey?.name, 'CRYPT_PRIVATE_KEY_PRODUCTION')
    assert.equal(privateKey?.value, 'helloworld')
  })

  test('should load from .env.keys', async ({ assert, fs }) => {
    await fs.mkdir('')
    await fs.create(
      '.env.keys',
      `
CRYPT_PRIVATE_KEY=shouldbeloaded
`
    )

    const privateKey = await CryptPrivateKey.load(fs.baseUrl)

    assert.equal(privateKey?.name, 'CRYPT_PRIVATE_KEY')
    assert.equal(privateKey?.value, 'shouldbeloaded')
  })

  test('should decrypt value', async ({ assert }) => {
    const pair = keypair()

    const privateKey = new CryptPrivateKey('CRYPT_PRIVATE_KEY', pair.privateKey)
    const publicKey = new CryptPublicKey('CRYPT_PUBLIC_KEY', pair.publicKey)

    const encrypted = encrypt('verysecretvalue', publicKey)
    const decrypted = privateKey.decrypt(encrypted)

    assert.notEqual(decrypted, encrypted)
    assert.equal(decrypted, 'verysecretvalue')
  })
})
