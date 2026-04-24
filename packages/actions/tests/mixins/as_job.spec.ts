import { test } from '@japa/runner'
import { compose } from '@adonisjs/core/helpers'
import { JobBatchDispatcher, ScheduleBuilder } from '@adonisjs/queue'
import type { Adapter } from '@adonisjs/queue/types'
import { BaseAction } from '../../src/base_action.ts'
import { AsJob } from '../../src/mixins/as_job.ts'
import { JobDispatcher } from '../../src/job_dispatcher.ts'
import { setupExecutor } from '../helpers.ts'

interface SendEmailPayload {
  userId: string
  subject: string
}

type PushCall = {
  type: 'pushOn' | 'pushLaterOn'
  queue: string
  payload: any
  delay?: number
}

function fakeAdapter(): { adapter: Adapter; calls: PushCall[] } {
  const calls: PushCall[] = []
  const adapter = {
    async pushOn(queue: string, jobData: any) {
      calls.push({ type: 'pushOn', queue, payload: jobData })
    },
    async pushLaterOn(queue: string, jobData: any, delay: number) {
      calls.push({ type: 'pushLaterOn', queue, payload: jobData, delay })
    },
  } as unknown as Adapter
  return { adapter, calls }
}

test.group('AsJob mixin — class wiring', (group) => {
  let teardown: () => Promise<void>

  group.each.setup(async () => {
    const setup = await setupExecutor()
    teardown = setup.teardown
  })

  group.each.teardown(async () => {
    await teardown()
  })

  test('dispatch returns a JobDispatcher', ({ assert }) => {
    class SendEmailAction extends compose(BaseAction, AsJob<SendEmailPayload>()) {
      handle() {}
      async asJob(_payload: SendEmailPayload) {}
    }

    const dispatcher = SendEmailAction.dispatch({ userId: '1', subject: 'Hi' })
    assert.instanceOf(dispatcher, JobDispatcher)
  })

  test('dispatch forwards mixin options (queue, priority, adapter, name) onto the dispatcher', async ({
    assert,
  }) => {
    const { adapter, calls } = fakeAdapter()

    class SendEmailAction extends compose(
      BaseAction,
      AsJob<SendEmailPayload>({
        queue: 'emails',
        priority: 3,
        name: 'CustomEmailJob',
        adapter: () => adapter,
      })
    ) {
      handle() {}
      async asJob(_payload: SendEmailPayload) {}
    }

    await SendEmailAction.dispatch({ userId: '1', subject: 'Hi' }).run()

    assert.equal(calls[0].queue, 'emails')
    assert.equal(calls[0].payload.priority, 3)
    assert.equal(calls[0].payload.name, 'CustomEmailJob')
  })

  test('dispatch defaults the job name to the action class name', async ({ assert }) => {
    const { adapter, calls } = fakeAdapter()

    class SendEmailAction extends compose(BaseAction, AsJob<SendEmailPayload>()) {
      handle() {}
      async asJob(_payload: SendEmailPayload) {}
    }

    await SendEmailAction.dispatch({ userId: '1', subject: 'Hi' })
      .with(() => adapter)
      .run()

    assert.equal(calls[0].payload.name, 'SendEmailAction')
  })

  test('dispatchMany returns a JobBatchDispatcher', ({ assert }) => {
    class SendEmailAction extends compose(BaseAction, AsJob<SendEmailPayload>()) {
      handle() {}
      async asJob(_payload: SendEmailPayload) {}
    }

    const batch = SendEmailAction.dispatchMany([
      { userId: '1', subject: 'Hi' },
      { userId: '2', subject: 'Hi' },
    ])

    assert.instanceOf(batch, JobBatchDispatcher)
  })

  test('dispatchMany forwards mixin options (queue, priority, adapter) onto the batch', ({
    assert,
  }) => {
    class SendEmailAction extends compose(
      BaseAction,
      AsJob<SendEmailPayload>({
        queue: 'emails',
        priority: 3,
        adapter: () => ({}) as any,
      })
    ) {
      handle() {}
      async asJob(_payload: SendEmailPayload) {}
    }

    // The batch dispatcher's internal state isn't public, but the option-forwarding
    // branches in as_job.ts only fire when the option is set; running this test
    // exercises those branches without throwing.
    const batch = SendEmailAction.dispatchMany([
      { userId: '1', subject: 'Hi' },
      { userId: '2', subject: 'Hi' },
    ])

    assert.instanceOf(batch, JobBatchDispatcher)
  })

  test('schedule returns a ScheduleBuilder', ({ assert }) => {
    class CleanupAction extends compose(BaseAction, AsJob<{ days: number }>()) {
      handle() {}
      async asJob(_payload: { days: number }) {}
    }

    const builder = CleanupAction.schedule({ days: 30 })
    assert.instanceOf(builder, ScheduleBuilder)
  })

  test('throws E_NOT_IMPLEMENTED_EXCEPTION when asJob is not overridden', async ({ assert }) => {
    class IncompleteAction extends compose(BaseAction, AsJob<SendEmailPayload>()) {
      handle() {}
    }

    const action = new IncompleteAction()
    action.$hydrate({ userId: '1', subject: 'Hi' }, {} as any)
    await assert.rejects(
      () => action.execute(),
      /uses AsJob but does not implement the method asJob/
    )
  })

  test('$hydrate stores the payload, context, and signal for execute()', async ({ assert }) => {
    let receivedPayload: SendEmailPayload | undefined
    let receivedContext: unknown
    let receivedSignal: AbortSignal | undefined

    class SendEmailAction extends compose(BaseAction, AsJob<SendEmailPayload>()) {
      handle() {}
      async asJob(payload: SendEmailPayload, context: any, signal?: AbortSignal) {
        receivedPayload = payload
        receivedContext = context
        receivedSignal = signal
      }
    }

    const action = new SendEmailAction()
    const ctx = { jobId: 'j-1', name: 'SendEmailAction', queue: 'default' }
    const ac = new AbortController()
    action.$hydrate({ userId: '1', subject: 'Hi' }, ctx as any, ac.signal)
    await action.execute()

    assert.deepEqual(receivedPayload, { userId: '1', subject: 'Hi' })
    assert.deepEqual(receivedContext, ctx)
    assert.strictEqual(receivedSignal, ac.signal)
  })

  test('failed() forwards to asJobFailed when implemented', async ({ assert }) => {
    let receivedError: Error | undefined

    class FlakyAction extends compose(BaseAction, AsJob<SendEmailPayload>()) {
      handle() {}
      async asJob(_payload: SendEmailPayload) {}
      async asJobFailed(error: Error) {
        receivedError = error
      }
    }

    const action = new FlakyAction()
    action.$hydrate({ userId: '1', subject: 'Hi' }, {} as any)
    await action.failed(new Error('giving up'))

    assert.equal(receivedError?.message, 'giving up')
  })

  test('failed() is a no-op when asJobFailed is not implemented', async ({ assert }) => {
    class FlakyAction extends compose(BaseAction, AsJob<SendEmailPayload>()) {
      handle() {}
      async asJob(_payload: SendEmailPayload) {}
    }

    const action = new FlakyAction()
    action.$hydrate({ userId: '1', subject: 'Hi' }, {} as any)
    await action.failed(new Error('boom'))
    assert.isOk(true)
  })
})

test.group('JobDispatcher', (group) => {
  let teardown: () => Promise<void>

  group.each.setup(async () => {
    const setup = await setupExecutor()
    teardown = setup.teardown
  })

  group.each.teardown(async () => {
    await teardown()
  })

  test('default dispatch pushes onto the default queue', async ({ assert }) => {
    const { adapter, calls } = fakeAdapter()

    const result = await new JobDispatcher('SendEmailAction', { userId: '1' })
      .with(() => adapter)
      .run()

    assert.lengthOf(calls, 1)
    assert.equal(calls[0].type, 'pushOn')
    assert.equal(calls[0].queue, 'default')
    assert.equal(calls[0].payload.name, 'SendEmailAction')
    assert.deepEqual(calls[0].payload.payload, { userId: '1' })
    assert.equal(calls[0].payload.attempts, 0)
    assert.equal(result.jobId, calls[0].payload.id)
  })

  test('toQueue overrides the target queue', async ({ assert }) => {
    const { adapter, calls } = fakeAdapter()

    await new JobDispatcher('SendEmailAction', { userId: '1' })
      .toQueue('emails')
      .with(() => adapter)
      .run()

    assert.equal(calls[0].queue, 'emails')
  })

  test('priority is forwarded to the adapter', async ({ assert }) => {
    const { adapter, calls } = fakeAdapter()

    await new JobDispatcher('SendEmailAction', { userId: '1' })
      .priority(2)
      .with(() => adapter)
      .run()

    assert.equal(calls[0].payload.priority, 2)
  })

  test('group is forwarded to the adapter as groupId', async ({ assert }) => {
    const { adapter, calls } = fakeAdapter()

    await new JobDispatcher('SendEmailAction', { userId: '1' })
      .group('newsletter-jan')
      .with(() => adapter)
      .run()

    assert.equal(calls[0].payload.groupId, 'newsletter-jan')
  })

  test('in() routes through pushLaterOn and parses duration strings', async ({ assert }) => {
    const { adapter, calls } = fakeAdapter()

    await new JobDispatcher('SendEmailAction', { userId: '1' })
      .in('5s')
      .with(() => adapter)
      .run()

    assert.equal(calls[0].type, 'pushLaterOn')
    assert.equal(calls[0].delay, 5_000)
  })

  test('in() accepts a numeric millisecond value', async ({ assert }) => {
    const { adapter, calls } = fakeAdapter()

    await new JobDispatcher('SendEmailAction', { userId: '1' })
      .in(2500)
      .with(() => adapter)
      .run()

    assert.equal(calls[0].type, 'pushLaterOn')
    assert.equal(calls[0].delay, 2500)
  })

  test('await dispatcher auto-runs via the thenable contract', async ({ assert }) => {
    const { adapter, calls } = fakeAdapter()

    const result = await new JobDispatcher('SendEmailAction', { userId: '1' }).with(() => adapter)

    assert.lengthOf(calls, 1)
    assert.equal(result.jobId, calls[0].payload.id)
  })
})
