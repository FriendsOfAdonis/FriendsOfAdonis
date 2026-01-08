import { test } from '@japa/runner'
import { CryptPublicKey } from '../src/public_key.ts'
import { keypair } from '../src/utils/keypair.ts'
import { CryptPrivateKey } from '../src/private_key.ts'
import { decrypt } from '../src/utils/decrypt.ts'

test.group('CryptPublicKey', (group) => {
  group.each.teardown(() => {
    delete process.env.NODE_ENV
    delete process.env.CRYPT_PUBLIC_KEY
    delete process.env.CRYPT_PUBLIC_KEY_PRODUCTION
    delete process.env.CRYPT_PRIVATE_KEY
    delete process.env.CRYPT_PRIVATE_KEY_PRODUCTION
  })

  test('should load from CRYPT_PUBLIC_KEY', async ({ assert, fs }) => {
    await fs.mkdir('')
    await fs.create(
      '.env',
      `
CRYPT_PUBLIC_KEY=helloworld
`
    )

    const publicKey = await CryptPublicKey.load(fs.baseUrl)

    assert.equal(publicKey?.name, 'CRYPT_PUBLIC_KEY')
    assert.equal(publicKey?.value, 'helloworld')
  })

  test('should load from CRYPT_PUBLIC_KEY with NODE_ENV=production', async ({ assert, fs }) => {
    process.env.NODE_ENV = 'production'

    await fs.mkdir('')
    await fs.create(
      '.env',
      `
CRYPT_PUBLIC_KEY=helloworld
`
    )

    const privateKey = await CryptPublicKey.load(fs.baseUrl)

    assert.equal(privateKey?.name, 'CRYPT_PUBLIC_KEY')
    assert.equal(privateKey?.value, 'helloworld')
  })

  test('should load from CRYPT_PRIVATE_KEY_PRODUCTION with NODE_ENV=production', async ({
    assert,
    fs,
  }) => {
    process.env.NODE_ENV = 'production'

    await fs.mkdir('')
    await fs.create(
      '.env.production',
      `
CRYPT_PUBLIC_KEY_PRODUCTION=helloworld
`
    )

    const publicKey = await CryptPublicKey.load(fs.baseUrl)

    assert.equal(publicKey?.name, 'CRYPT_PUBLIC_KEY_PRODUCTION')
    assert.equal(publicKey?.value, 'helloworld')
  })

  test('should encrypt value', async ({ assert }) => {
    const pair = keypair()

    const publicKey = new CryptPublicKey('CRYPT_PUBLIC_KEY', pair.publicKey)
    const privateKey = new CryptPrivateKey('CRYPT_PRIVATE_KEY', pair.privateKey)

    const encrypted = publicKey.encrypt('helloworld')
    const decrypted = decrypt(encrypted, privateKey)

    assert.notEqual(encrypted, decrypted)
    assert.equal(decrypted, 'helloworld')
  })
})
