import { IncomingMessage, ServerResponse } from 'node:http'
import { Socket } from 'node:net'
import { HttpContextFactory, RequestFactory, ResponseFactory } from '@adonisjs/core/factories/http'
import type { HttpContext } from '@adonisjs/core/http'
import { test } from '@japa/runner'
import { E_INVALID_CREDENTIALS, E_INVALID_PASSWORD } from '../../modules/password/errors.ts'

const MESSAGE = 'Invalid user credentials'

/**
 * Records the calls made to the session store of "@adonisjs/session".
 */
function createSession() {
  const calls: Array<[string, ...unknown[]]> = []

  return {
    calls,
    flashExcept: (keys: string[]) => calls.push(['flashExcept', keys]),
    flash: (key: string, value: unknown) => calls.push(['flash', key, value]),
    flashErrors: (errors: Record<string, string>) => calls.push(['flashErrors', errors]),
  }
}

/**
 * HTTP context negotiating the given content type.
 */
function createContext(accept?: string, session?: ReturnType<typeof createSession>) {
  const req = new IncomingMessage(new Socket())
  if (accept) {
    req.headers.accept = accept
  }

  const res = new ServerResponse(req)
  const ctx = new HttpContextFactory()
    .merge({
      request: new RequestFactory().merge({ req, res }).create(),
      response: new ResponseFactory().merge({ req, res }).create(),
    })
    .create()

  if (session) {
    Object.assign(ctx, { session })
  }

  return ctx
}

test.group('E_INVALID_CREDENTIALS', () => {
  test('should carry the code, the status and the message of the auth exception', ({ assert }) => {
    const error = new E_INVALID_CREDENTIALS()

    assert.equal(error.code, 'E_INVALID_CREDENTIALS')
    assert.equal(error.status, 400)
    assert.equal(error.message, MESSAGE)
    assert.equal(error.identifier, 'errors.E_INVALID_CREDENTIALS')
  })

  test('should render the error as JSON', async ({ assert }) => {
    const error = new E_INVALID_CREDENTIALS()
    const ctx = createContext('application/json')

    await error.handle(error, ctx)

    assert.equal(ctx.response.getStatus(), 400)
    assert.deepEqual(ctx.response.getBody(), { errors: [{ message: MESSAGE }] })
  })

  test('should render the error as JSON API', async ({ assert }) => {
    const error = new E_INVALID_CREDENTIALS()
    const ctx = createContext('application/vnd.api+json')

    await error.handle(error, ctx)

    assert.equal(ctx.response.getStatus(), 400)
    assert.deepEqual(ctx.response.getBody(), {
      errors: [{ code: 'E_INVALID_CREDENTIALS', title: MESSAGE }],
    })
  })

  test('should send the message when the request accepts HTML without a session', async ({
    assert,
  }) => {
    const error = new E_INVALID_CREDENTIALS()
    const ctx = createContext('text/html')

    await error.handle(error, ctx)

    assert.equal(ctx.response.getStatus(), 400)
    assert.equal(ctx.response.getBody(), MESSAGE)
  })

  test('should flash the error and redirect back when a session is available', async ({
    assert,
  }) => {
    const error = new E_INVALID_CREDENTIALS()
    const session = createSession()
    const ctx = createContext('text/html', session)

    await error.handle(error, ctx)

    assert.equal(ctx.response.getStatus(), 302)
    assert.deepEqual(session.calls, [
      ['flashExcept', ['_csrf', '_method', 'password', 'password_confirmation']],
      ['flash', 'error', MESSAGE],
      ['flashErrors', { E_INVALID_CREDENTIALS: MESSAGE }],
    ])
  })

  test('should translate the message when i18n is available', async ({ assert }) => {
    const error = new E_INVALID_CREDENTIALS()
    const ctx = createContext('application/json')
    const translated: unknown[] = []

    Object.assign(ctx, {
      i18n: {
        t: (...args: unknown[]) => {
          translated.push(args)
          return 'Identifiants invalides'
        },
      },
    })

    await error.handle(error, ctx as HttpContext)

    assert.deepEqual(translated, [['errors.E_INVALID_CREDENTIALS', {}, MESSAGE]])
    assert.deepEqual(ctx.response.getBody(), { errors: [{ message: 'Identifiants invalides' }] })
  })
})

test.group('E_INVALID_PASSWORD', () => {
  test('should carry its code, status and message', ({ assert }) => {
    const error = new E_INVALID_PASSWORD()

    assert.equal(error.code, 'E_INVALID_PASSWORD')
    assert.equal(error.status, 400)
    assert.equal(error.message, 'The current password is incorrect.')
  })
})
