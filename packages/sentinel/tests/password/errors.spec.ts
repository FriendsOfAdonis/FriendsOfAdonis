import { test } from '@japa/runner'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import { HttpContextFactory } from '@adonisjs/core/factories/http'
import { E_INVALID_CREDENTIALS, E_INVALID_PASSWORD } from '../../modules/password/errors.ts'
import * as errors from '../../src/errors.ts'

/**
 * Session fake recording the flash calls of the exception handler
 */
function fakeSession() {
  const session = {
    excluded: [] as string[],
    flashed: {} as Record<string, unknown>,
    errors: {} as Record<string, string>,
    flashExcept(keys: string[]) {
      session.excluded = keys
    },
    flash(key: string, value: unknown) {
      session.flashed[key] = value
    },
    flashErrors(messages: Record<string, string>) {
      Object.assign(session.errors, messages)
    },
  }

  return session
}

/**
 * HTTP context negotiating the given content type
 */
function fakeContext(accept?: string) {
  const ctx = new HttpContextFactory().create()

  if (accept) {
    ctx.request.request.headers.accept = accept
  }

  return ctx
}

test.group('Password errors', () => {
  test('describe invalid credentials as a bad request', ({ assert }) => {
    const error = new E_INVALID_CREDENTIALS()

    assert.instanceOf(error, Exception)
    assert.equal(error.status, 400)
    assert.equal(error.code, 'E_INVALID_CREDENTIALS')
    assert.equal(error.message, 'Invalid user credentials')
    assert.equal(error.identifier, 'errors.E_INVALID_CREDENTIALS')
  })

  test('describe a wrong current password as a bad request', ({ assert }) => {
    const error = new E_INVALID_PASSWORD()

    assert.instanceOf(error, Exception)
    assert.equal(error.status, 400)
    assert.equal(error.code, 'E_INVALID_PASSWORD')
    assert.equal(error.message, 'The current password is incorrect.')
  })

  test('expose the errors from the errors entrypoint', ({ assert }) => {
    assert.strictEqual(errors.E_INVALID_CREDENTIALS, E_INVALID_CREDENTIALS)
    assert.strictEqual(errors.E_INVALID_PASSWORD, E_INVALID_PASSWORD)
  })
})

test.group('Password errors | E_INVALID_CREDENTIALS rendering', () => {
  test('send the message as plain text for browser requests without session', async ({
    assert,
  }) => {
    const error = new E_INVALID_CREDENTIALS()
    const ctx = fakeContext('text/html')

    await error.handle(error, ctx)

    assert.equal(ctx.response.getStatus(), 400)
    assert.equal(ctx.response.getBody(), 'Invalid user credentials')
  })

  test('flash the error and redirect back when the session is available', async ({ assert }) => {
    const error = new E_INVALID_CREDENTIALS()
    const ctx = fakeContext('text/html')

    /**
     * The factory hands the request and the response their own fake
     * raw request, and "redirect('back')" reads the referer from the
     * one of the response
     */
    ctx.request.request.headers.referer = '/login'
    ctx.response.request.headers.referer = '/login'

    const session = fakeSession()
    ;(ctx as HttpContext & { session: unknown }).session = session

    await error.handle(error, ctx)

    assert.equal(ctx.response.getStatus(), 302)
    assert.equal(ctx.response.getHeader('location'), '/login')
    assert.deepEqual(session.excluded, ['_csrf', '_method', 'password', 'password_confirmation'])
    assert.deepEqual(session.flashed, { error: 'Invalid user credentials' })
    assert.deepEqual(session.errors, { E_INVALID_CREDENTIALS: 'Invalid user credentials' })
  })

  test('send a JSON error for JSON requests', async ({ assert }) => {
    const error = new E_INVALID_CREDENTIALS()
    const ctx = fakeContext('application/json')

    await error.handle(error, ctx)

    assert.equal(ctx.response.getStatus(), 400)
    assert.deepEqual(ctx.response.getBody(), {
      errors: [{ message: 'Invalid user credentials' }],
    })
  })

  test('send a JSON API error for JSON API requests', async ({ assert }) => {
    const error = new E_INVALID_CREDENTIALS()
    const ctx = fakeContext('application/vnd.api+json')

    await error.handle(error, ctx)

    assert.equal(ctx.response.getStatus(), 400)
    assert.deepEqual(ctx.response.getBody(), {
      errors: [{ code: 'E_INVALID_CREDENTIALS', title: 'Invalid user credentials' }],
    })
  })

  test('translate the message when i18n is available', async ({ assert }) => {
    const error = new E_INVALID_CREDENTIALS()
    const ctx = fakeContext('application/json')

    /**
     * Translator fake echoing the identifier and the fallback it was
     * given
     */
    ;(ctx as HttpContext & { i18n: unknown }).i18n = {
      t: (identifier: string, _data: Record<string, unknown>, fallback: string) =>
        `translated ${identifier} (${fallback})`,
    }

    await error.handle(error, ctx)

    assert.deepEqual(ctx.response.getBody(), {
      errors: [
        { message: 'translated errors.E_INVALID_CREDENTIALS (Invalid user credentials)' },
      ],
    })
  })

  test('fall back to the message when i18n is not available', ({ assert }) => {
    const error = new E_INVALID_CREDENTIALS()
    const ctx = fakeContext()

    assert.equal(error.getResponseMessage(error, ctx), 'Invalid user credentials')
  })
})
