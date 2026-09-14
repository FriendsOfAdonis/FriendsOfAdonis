import { test } from '@japa/runner'
import { Exception } from '@adonisjs/core/exceptions'
import { E_INVALID_TOKEN, E_TOO_MANY_ATTEMPTS } from '../../modules/token/errors.ts'
import * as errors from '../../src/errors.ts'

test.group('Token errors', () => {
  test('describe an invalid token as an unauthorized request', ({ assert }) => {
    const error = new E_INVALID_TOKEN('otp')

    assert.instanceOf(error, Exception)
    assert.equal(error.status, 401)
    assert.equal(error.code, 'E_INVALID_TOKEN')
    assert.equal(error.message, 'The provided token is either invalid or expired.')
    assert.equal(error.kind, 'otp')
    assert.isUndefined(error.purpose)
  })

  test('tell which token was expected', ({ assert }) => {
    const error = new E_INVALID_TOKEN('magic_link', 'signin')

    assert.equal(error.kind, 'magic_link')
    assert.equal(error.purpose, 'signin')
  })

  test('describe too many attempts as too many requests', ({ assert }) => {
    const error = new E_TOO_MANY_ATTEMPTS('otp', 'signin')

    assert.equal(error.status, 429)
    assert.equal(error.code, 'E_TOO_MANY_ATTEMPTS')
    assert.equal(error.message, 'Too many failed attempts, the token has been invalidated.')
    assert.equal(error.kind, 'otp')
    assert.equal(error.purpose, 'signin')
  })

  test('let a handler of invalid tokens catch lockouts as well', ({ assert }) => {
    assert.instanceOf(new E_TOO_MANY_ATTEMPTS('otp'), E_INVALID_TOKEN)
    assert.notInstanceOf(new E_INVALID_TOKEN('otp'), E_TOO_MANY_ATTEMPTS)
  })

  test('expose the errors from the errors entrypoint', ({ assert }) => {
    assert.strictEqual(errors.E_INVALID_TOKEN, E_INVALID_TOKEN)
    assert.strictEqual(errors.E_TOO_MANY_ATTEMPTS, E_TOO_MANY_ATTEMPTS)
  })
})
