import { test } from '@japa/runner'
import { Mailer } from '@adonisjs/mail'
import { SMTPTransport } from '@adonisjs/mail/transports/smtp'
import { CONTAINERS, setupApp } from '../helpers.js'
import { StartedTestContainer } from 'testcontainers'
import { MailTransportContract } from '@adonisjs/mail/types'
import { EmitterFactory } from '@adonisjs/core/factories/events'
import { ApplicationService } from '@adonisjs/core/types'
import ky, { KyInstance } from 'ky'
import { NotificationTransportContract } from '@foadonis/notifier/types'
import { MailNotificationTransport } from '../../src/transports/mail_notification_transport.js'
import { MailMessage } from '../../src/messages/mail_message.js'
import { MailFakeNotification } from '../fixtures/fake_notification.js'
import { FakeNotifiable } from '../fixtures/fake_notifiable.js'

test.group('MailNotificationTransport', (group) => {
  let app: ApplicationService
  let container: StartedTestContainer
  let client: KyInstance
  let transport: MailNotificationTransport

  group.setup(async () => {
    const project = await setupApp()
    app = project.app
    container = await CONTAINERS.mailhog.start()

    client = ky.create({
      prefixUrl: `http://${container.getHost()}:${container.getMappedPort(8025)}`,
    })

    const mailer = new Mailer(
      'test',
      new SMTPTransport({
        host: container.getHost(),
        port: container.getMappedPort(1025),
      }),
      new EmitterFactory().create(app)
    )

    transport = new MailNotificationTransport(mailer)
  })

  group.teardown(async () => {
    await container.stop()
    await app.terminate()
  })

  test('toMessage', async ({ expect }) => {
    const notification = new MailFakeNotification()
    const notifiable = new FakeNotifiable()
    const message = transport.toMessage(notification, notifiable)
    expect(message).toBeDefined()
    expect(message?.nodeMailerMessage.to?.[0]).toBe('test@friendsofadonis.com')
  })

  test('notify', async ({ expect }) => {
    const mail = new MailMessage()
      .from('from@friendsofadonis.com')
      .to('to@friendsofadonis.com')
      .text('Hello World')

    await transport.send(mail)

    const res = await client.get('api/v2/messages').json<any>()

    expect(res.total).toBe(1)
    expect(res.items[0].To[0].Domain).toBe('friendsofadonis.com')
  })
})
