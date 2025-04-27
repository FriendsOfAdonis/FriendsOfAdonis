import { test } from '@japa/runner'
import {
  FakeNotification,
  MailFakeNotification,
  SMSFakeNotification,
} from './fixtures/fake_notification.js'
import { AssertionError } from 'node:assert'
import { createFakeNotifier } from './helpers.js'
import { FakeNotifiable } from './fixtures/fake_notifiable.js'

test.group('FakeNotifier', () => {
  test('assertSent', async () => {
    const { manager, fake } = createFakeNotifier()

    await manager.notify(new FakeNotifiable(), new FakeNotification())

    fake.assertSent(FakeNotification)
  })

  test('assertCount', async () => {
    const { manager, fake } = createFakeNotifier()
    fake.assertCount(0)

    await manager.notify(new FakeNotifiable(), new FakeNotification())
    await manager.notify(new FakeNotifiable(), new MailFakeNotification())
    await manager.notify(new FakeNotifiable(), new SMSFakeNotification())

    fake.assertCount(3)
    fake.assertCount(2, (notification) => notification.hasChannel('mail'))
    fake.assertCount(1, (notification) => [notification.isInstanceOf(SMSFakeNotification)])
  })

  test('assertNothingSent', async ({ expect }) => {
    const { manager, fake } = createFakeNotifier()

    fake.assertNothingSent()

    await manager.notify(new FakeNotifiable(), new FakeNotification())

    expect(() => fake.assertNothingSent()).toThrowError(AssertionError)
  })

  test('clear', async ({ expect }) => {
    const { manager, fake } = createFakeNotifier()

    await manager.notify(new FakeNotifiable(), new FakeNotification())

    fake.assertSent(FakeNotification)

    fake.clear()

    expect(() => fake.assertSent(FakeNotification)).toThrowError(AssertionError)
  })
})
