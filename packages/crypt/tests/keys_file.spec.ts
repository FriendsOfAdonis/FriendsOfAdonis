import { test } from '@japa/runner'
import { KeysFile } from '../src/keys_file.ts'
import { join } from 'node:path'

test.group('KeysFile', () => {
  test('should create empty .env.keys', async ({ assert, fs }) => {
    await fs.mkdir('')

    const file = new KeysFile(join(fs.basePath, '.env.keys'), {})
    await file.save()

    await assert.fileExists('.env.keys')
    await assert.fileContains('.env.keys', '!CRYPT PRIVATE KEYS!')
  })

  test('should load existing .env.keys', async ({ assert, fs }) => {
    await fs.mkdir('')

    await fs.create(
      '.env.keys',
      `
CRYPT_PRIVATE_KEY=devkey
CRYPT_PRIVATE_KEY_PRODUCTION=productionkey
`
    )

    const file = await KeysFile.load(join(fs.basePath, '.env.keys'))
    await file.save()

    assert.equal(file.get('CRYPT_PRIVATE_KEY'), 'devkey')
    assert.equal(file.get('CRYPT_PRIVATE_KEY_PRODUCTION'), 'productionkey')

    await assert.fileExists('.env.keys')
    await assert.fileContains('.env.keys', '!CRYPT PRIVATE KEYS!')
    await assert.fileContains('.env.keys', 'CRYPT_PRIVATE_KEY=')
    await assert.fileContains('.env.keys', 'CRYPT_PRIVATE_KEY_PRODUCTION=')
  })

  test('should update .env.keys', async ({ assert, fs }) => {
    await fs.mkdir('')

    const file = new KeysFile(join(fs.basePath, '.env.keys'), {})

    file.set('CRYPT_PRIVATE_KEY', 'helloworld')

    await file.save()

    await assert.fileExists('.env.keys')
    await assert.fileContains('.env.keys', '!CRYPT PRIVATE KEYS!')
    await assert.fileContains('.env.keys', 'CRYPT_PRIVATE_KEY="helloworld"')
  })
})
