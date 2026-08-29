import { test } from '@japa/runner'
import { randomBytes } from 'node:crypto'
import { Secret as OTPAuthSecret } from 'otpauth'
import {
  base32Encode,
  generateBackupCode,
  generateBackupCodes,
  generateSecret,
  normalizeBackupCode,
} from '../../modules/totp/utils.ts'

const CROCKFORD = /^[0-9A-HJKMNP-TV-Z]+$/

test.group('TOTP utils | base32Encode', () => {
  test('encode "{input}" to "{output}"')
    .with([
      { input: '', output: '' },
      { input: 'f', output: 'MY' },
      { input: 'fo', output: 'MZXQ' },
      { input: 'foo', output: 'MZXW6' },
      { input: 'foob', output: 'MZXW6YQ' },
      { input: 'fooba', output: 'MZXW6YTB' },
      { input: 'foobar', output: 'MZXW6YTBOI' },
    ])
    .run(({ assert }, { input, output }) => {
      /**
       * RFC 4648 section 10 vectors, padding stripped
       */
      assert.equal(base32Encode(Buffer.from(input, 'utf8')), output)
    })

  test('encode bytes the authenticator applications decode back', ({ assert }) => {
    const bytes = randomBytes(40)
    const decoded = OTPAuthSecret.fromBase32(base32Encode(bytes)).bytes

    assert.deepEqual(Buffer.from(decoded), bytes)
  })
})

test.group('TOTP utils | generateSecret', () => {
  test('generate a base32 secret of {length} bytes')
    .with([
      { length: 20, chars: 32 },
      { length: 40, chars: 64 },
    ])
    .run(({ assert }, { length, chars }) => {
      const secret = generateSecret(length)

      assert.lengthOf(secret, chars)
      assert.match(secret, /^[A-Z2-7]+$/)
    })

  test('generate a different secret on every call', ({ assert }) => {
    assert.notEqual(generateSecret(40), generateSecret(40))
  })
})

test.group('TOTP utils | generateBackupCode', () => {
  test('generate a code of two groups of five characters by default', ({ assert }) => {
    const code = generateBackupCode()

    assert.match(code, /^[0-9A-HJKMNP-TV-Z]{5}-[0-9A-HJKMNP-TV-Z]{5}$/)
  })

  test('generate a code of the given length', ({ assert }) => {
    const code = generateBackupCode(16)
    const [head, tail] = code.split('-')

    assert.lengthOf(head, 5)
    assert.lengthOf(tail, 11)
    assert.match(head + tail, CROCKFORD)
  })

  test('never use the characters confused with others', ({ assert }) => {
    const codes = Array.from({ length: 200 }, () => generateBackupCode().replace('-', ''))

    for (const code of codes) {
      assert.match(code, CROCKFORD)
    }
  })

  test('generate the requested number of unique codes', ({ assert }) => {
    const codes = generateBackupCodes(10, 8)

    assert.lengthOf(codes, 10)
    assert.lengthOf(new Set(codes), 10)

    for (const code of codes) {
      assert.lengthOf(code.replace('-', ''), 8)
    }
  })
})

test.group('TOTP utils | normalizeBackupCode', () => {
  test('normalize "{input}" to "{output}"')
    .with([
      { input: 'ABCDE-FGHJK', output: 'ABCDEFGHJK' },
      { input: 'abcde-fghjk', output: 'ABCDEFGHJK' },
      { input: '  abcde fghjk  ', output: 'ABCDEFGHJK' },
      { input: 'abcde_fghjk', output: 'ABCDEFGHJK' },
      { input: '', output: '' },
    ])
    .run(({ assert }, { input, output }) => {
      assert.equal(normalizeBackupCode(input), output)
    })
})
