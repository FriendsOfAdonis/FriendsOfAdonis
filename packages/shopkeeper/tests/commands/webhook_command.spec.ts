import { test } from '@japa/runner'
import WebhookCommand from '../../commands/webhook_command.js'
import string from '@adonisjs/core/helpers/string'
import { createApp } from '../app.js'

test.group('WebhookCommand', () => {
  test('webhook cannot be created without url', async () => {
    const { app, ace } = await createApp()
    app.config.set('app.appUrl', undefined)
    const command = await ace.create(WebhookCommand, [])
    ace.ui.switchMode('raw')
    await command.exec()

    command.assertLogMatches(/--url/, 'stderr')
    command.assertFailed()
  })

  test('webhook can be created with --url', async ({ assert }) => {
    const { ace, shopkeeper } = await createApp()
    const url = `https://example-${string.slug(string.random(5)).toLowerCase()}.org/stripe/webhook`
    const command = await ace.create(WebhookCommand, ['--url', url])
    await command.exec()

    command.assertSucceeded()

    const webhooks = await shopkeeper.stripe.webhookEndpoints.list()
    const webhook = webhooks.data.find((wh) => wh.url === url)
    assert.isDefined(webhook)

    await shopkeeper.stripe.webhookEndpoints.del(webhook!.id)
  })

  test('webhook can be created with app.appConfig', async ({ assert }) => {
    const { app, ace, shopkeeper } = await createApp()
    const url = `https://example-${string.slug(string.random(5)).toLowerCase()}.org`

    app.config.set('app.appUrl', url)

    const command = await ace.create(WebhookCommand, [])
    await command.exec()

    command.assertSucceeded()

    const webhooks = await shopkeeper.stripe.webhookEndpoints.list()
    const webhook = webhooks.data.find((wh) => wh.url.startsWith(url))
    assert.isDefined(webhook)

    await shopkeeper.stripe.webhookEndpoints.del(webhook!.id)
  })
})
