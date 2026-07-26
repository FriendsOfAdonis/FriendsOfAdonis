import { IgnitorFactory } from '@adonisjs/core/factories'
import { test } from '@japa/runner'
import MakeActionCommand from '../../commands/make_action.ts'
import { BASE_URL } from '../helpers.ts'

test.group('make:action', () => {
  test('scaffolds an action file under app/actions/', async ({ assert }) => {
    const ignitor = new IgnitorFactory()
      .withCoreProviders()
      .withCoreConfig()
      .create(BASE_URL, {
        importer: (filePath) => {
          if (filePath.startsWith('./') || filePath.startsWith('../')) {
            return import(new URL(filePath, BASE_URL).href)
          }
          return import(filePath)
        },
      })

    const app = ignitor.createApp('console')
    await app.init()
    await app.boot()

    const ace = await app.container.make('ace')
    const command = await ace.create(MakeActionCommand, ['CreateUser'])
    await command.exec()

    command.assertSucceeded()

    await assert.fileExists('app/actions/create_user_action.ts')
    await assert.fileContains(
      'app/actions/create_user_action.ts',
      "import { BaseAction } from '@foadonis/actions'"
    )
    await assert.fileContains(
      'app/actions/create_user_action.ts',
      'export default class CreateUserAction extends BaseAction'
    )
  }).timeout(30000)

  test('snake-cases the file name and pascal-cases the class', async ({ assert }) => {
    const ignitor = new IgnitorFactory()
      .withCoreProviders()
      .withCoreConfig()
      .create(BASE_URL, {
        importer: (filePath) => {
          if (filePath.startsWith('./') || filePath.startsWith('../')) {
            return import(new URL(filePath, BASE_URL).href)
          }
          return import(filePath)
        },
      })

    const app = ignitor.createApp('console')
    await app.init()
    await app.boot()

    const ace = await app.container.make('ace')
    const command = await ace.create(MakeActionCommand, ['SendWelcomeEmail'])
    await command.exec()

    command.assertSucceeded()

    await assert.fileExists('app/actions/send_welcome_email_action.ts')
    await assert.fileContains(
      'app/actions/send_welcome_email_action.ts',
      'class SendWelcomeEmailAction'
    )
  }).timeout(30000)
})
