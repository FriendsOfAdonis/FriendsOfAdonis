import { test } from '@japa/runner'
import { Secret } from '@adonisjs/core/helpers'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { EncryptionFactory } from '@adonisjs/core/factories/encryption'
import { TOTPManagerFactory } from '../../factories/totp.ts'
import { TOTPManager } from '../../modules/totp/manager.ts'
import { TOTP_BACKUP_CODES_PURPOSE, TOTP_SECRET_PURPOSE } from '../../modules/totp/constants.ts'
import { createForeignEncryption } from '../helpers.ts'

const BACKUP_CODE = /^[0-9A-HJKMNP-TV-Z]{5}-[0-9A-HJKMNP-TV-Z]{5}$/

test.group('TOTP manager | secret', () => {
  test('create a secret of 40 random bytes by default', ({ assert }) => {
    const manager = new TOTPManagerFactory().create()
    const { secret, encryptedSecret } = manager.createSecret()

    assert.instanceOf(secret, Secret)
    assert.lengthOf(secret.release(), 64)
    assert.match(secret.release(), /^[A-Z2-7]+$/)
    assert.notInclude(encryptedSecret, secret.release())
  })

  test('create a secret of the length configured on the manager', ({ assert }) => {
    const manager = new TOTPManagerFactory().create({ issuer: 'FriendsOfAdonis', secretLength: 20 })
    const { secret } = manager.createSecret()

    assert.lengthOf(secret.release(), 32)
  })

  test('give precedence to the length given at creation time', ({ assert }) => {
    const manager = new TOTPManagerFactory().create({ issuer: 'FriendsOfAdonis', secretLength: 20 })
    const { secret } = manager.createSecret(10)

    assert.lengthOf(secret.release(), 16)
  })

  test('encrypt the secret for the secret purpose only', ({ assert }) => {
    const encryption = new EncryptionFactory().create()
    const manager = new TOTPManagerFactory().withEncryption(encryption).create()
    const { secret, encryptedSecret } = manager.createSecret()

    assert.equal(encryption.decrypt(encryptedSecret, TOTP_SECRET_PURPOSE), secret.release())
    assert.isNull(encryption.decrypt(encryptedSecret))
    assert.isNull(encryption.decrypt(encryptedSecret, TOTP_BACKUP_CODES_PURPOSE))
  })

  test('decrypt a secret it encrypted', ({ assert }) => {
    const manager = new TOTPManagerFactory().create()
    const { secret, encryptedSecret } = manager.createSecret()
    const decrypted = manager.decryptSecret(encryptedSecret)

    assert.instanceOf(decrypted, Secret)
    assert.equal(decrypted.release(), secret.release())
  })

  test('refuse a secret encrypted with a different application key', ({ assert }) => {
    const { encryptedSecret } = new TOTPManagerFactory().create().createSecret()
    const manager = new TOTPManagerFactory().withEncryption(createForeignEncryption()).create()

    assert.throws(
      () => manager.decryptSecret(encryptedSecret),
      RuntimeException,
      /encrypted with a different application key/
    )
  })

  test('refuse a payload encrypted for a different purpose', ({ assert }) => {
    const manager = new TOTPManagerFactory().create()
    const encryptedCodes = manager.encryptBackupCodes(['ABCDE-FGHJK'])

    assert.throws(() => manager.decryptSecret(encryptedCodes), RuntimeException)
  })

  test('refuse a tampered payload', ({ assert }) => {
    const manager = new TOTPManagerFactory().create()

    assert.throws(() => manager.decryptSecret('not-an-encrypted-secret'), RuntimeException)
  })
})

test.group('TOTP manager | backup codes', () => {
  test('create 10 codes of 10 characters by default', ({ assert }) => {
    const manager = new TOTPManagerFactory().create()
    const { codes, encryptedCodes } = manager.createBackupCodes()

    assert.lengthOf(codes, 10)
    assert.lengthOf(new Set(codes), 10)
    assert.isString(encryptedCodes)

    for (const code of codes) {
      assert.match(code, BACKUP_CODE)
      assert.notInclude(encryptedCodes, code)
    }
  })

  test('create the codes configured on the manager', ({ assert }) => {
    const manager = new TOTPManagerFactory().create({
      issuer: 'FriendsOfAdonis',
      backupCodesCount: 4,
      backupCodesLength: 12,
    })
    const { codes } = manager.createBackupCodes()

    assert.lengthOf(codes, 4)
    for (const code of codes) {
      assert.lengthOf(code.replace('-', ''), 12)
    }
  })

  test('give precedence to the count and length given at creation time', ({ assert }) => {
    const manager = new TOTPManagerFactory().create({
      issuer: 'FriendsOfAdonis',
      backupCodesCount: 4,
      backupCodesLength: 12,
    })
    const { codes } = manager.createBackupCodes(2, 8)

    assert.lengthOf(codes, 2)
    for (const code of codes) {
      assert.lengthOf(code.replace('-', ''), 8)
    }
  })

  test('encrypt the codes for the backup codes purpose only', ({ assert }) => {
    const encryption = new EncryptionFactory().create()
    const manager = new TOTPManagerFactory().withEncryption(encryption).create()
    const { codes, encryptedCodes } = manager.createBackupCodes()

    assert.deepEqual(encryption.decrypt(encryptedCodes, TOTP_BACKUP_CODES_PURPOSE), codes)
    assert.isNull(encryption.decrypt(encryptedCodes))
    assert.isNull(encryption.decrypt(encryptedCodes, TOTP_SECRET_PURPOSE))
  })

  test('decrypt the codes it encrypted', ({ assert }) => {
    const manager = new TOTPManagerFactory().create()
    const { codes, encryptedCodes } = manager.createBackupCodes()

    assert.deepEqual(manager.decryptBackupCodes(encryptedCodes), codes)
    assert.deepEqual(manager.decryptBackupCodes(manager.encryptBackupCodes(codes)), codes)
  })

  test('refuse codes encrypted with a different application key', ({ assert }) => {
    const { encryptedCodes } = new TOTPManagerFactory().create().createBackupCodes()
    const manager = new TOTPManagerFactory().withEncryption(createForeignEncryption()).create()

    assert.throws(
      () => manager.decryptBackupCodes(encryptedCodes),
      RuntimeException,
      /encrypted with a different application key/
    )
  })

  test('refuse a payload encrypted for a different purpose', ({ assert }) => {
    const manager = new TOTPManagerFactory().create()
    const { encryptedSecret } = manager.createSecret()

    assert.throws(() => manager.decryptBackupCodes(encryptedSecret), RuntimeException)
  })
})

test.group('TOTP manager | config', () => {
  test('expose the config it was created with', ({ assert }) => {
    const config = { issuer: 'FriendsOfAdonis', digits: 8, period: 60 }
    const manager = new TOTPManagerFactory().create(config)

    assert.instanceOf(manager, TOTPManager)
    assert.deepEqual(manager.config, config)
  })
})
