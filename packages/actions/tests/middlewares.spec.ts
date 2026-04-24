import { test } from '@japa/runner'
import { middlewares } from '../src/middlewares.ts'

function fakeLogger() {
  const calls: any[] = []
  const logger: any = {
    child(bindings: any) {
      calls.push(bindings)
      return logger
    },
  }
  return { logger, calls }
}

test.group('middlewares.asController.scopedLogger', () => {
  test('replaces action.logger with the HttpContext logger child, scoped by action name', ({
    assert,
  }) => {
    const ctxLogger = fakeLogger()
    const action: any = { logger: { child: () => ({}) } }
    const actionClass: any = { displayName: 'CreateUserAction' }

    middlewares.asController.scopedLogger(
      [{ logger: ctxLogger.logger } as any],
      action,
      actionClass
    )

    assert.deepEqual(ctxLogger.calls, [{ action: 'CreateUserAction' }])
    assert.strictEqual(action.logger, ctxLogger.logger)
  })
})

test.group('middlewares.asListener.scopedLogger', () => {
  test('chains action.logger with action name + inspected event', ({ assert }) => {
    const { logger, calls } = fakeLogger()
    const action: any = { logger }
    const actionClass: any = { displayName: 'WelcomeAction' }
    const event = { userId: 'u-1' }

    middlewares.asListener.scopedLogger([event] as any, action, actionClass)

    assert.lengthOf(calls, 1)
    assert.equal(calls[0].action, 'WelcomeAction')
    assert.match(calls[0].event, /userId/)
    assert.match(calls[0].event, /u-1/)
  })
})

test.group('middlewares.asJob.scopedLogger', () => {
  test('chains action.logger with job context fields', ({ assert }) => {
    const { logger, calls } = fakeLogger()
    const action: any = { logger }
    const actionClass: any = { displayName: 'SendEmailAction' }
    const jobContext = { jobId: 'j-1', name: 'SendEmailAction', queue: 'emails' }

    middlewares.asJob.scopedLogger([{}, jobContext] as any, action, actionClass)

    assert.deepEqual(calls, [
      {
        action: 'SendEmailAction',
        queue: 'emails',
        job_id: 'j-1',
        job_name: 'SendEmailAction',
      },
    ])
  })
})
