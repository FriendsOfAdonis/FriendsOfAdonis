import { test } from '@japa/runner'
import { fileURLToPath } from 'node:url'
import { ActionCommandsLoader } from '../src/commands_loader.ts'

test.group('ActionCommandsLoader — serialize', () => {
  test('uses generateCommandName when no $commandOptions are set', ({ assert }) => {
    class CreateUserAction {}
    const loader = new ActionCommandsLoader('/tmp')
    const meta = loader.serialize(CreateUserAction as any)

    assert.equal(meta.commandName, 'action:create-user')
    assert.equal(meta.description, 'Run the action CreateUserAction')
    assert.equal(meta.namespace, 'action')
    assert.deepEqual(meta.aliases, [])
    assert.deepEqual(meta.flags, [])
    assert.deepEqual(meta.args, [])
  })

  test('reads commandName / description / aliases from $commandOptions', ({ assert }) => {
    class SendEmailAction {
      static $commandOptions = {
        commandName: 'mails:send',
        description: 'Send an email',
        aliases: ['email:send'],
      }
    }
    const loader = new ActionCommandsLoader('/tmp')
    const meta = loader.serialize(SendEmailAction as any)

    assert.equal(meta.commandName, 'mails:send')
    assert.equal(meta.description, 'Send an email')
    assert.equal(meta.namespace, 'mails')
    assert.deepEqual(meta.aliases, ['email:send'])
  })

  test('namespace is null when commandName has no colon', ({ assert }) => {
    class TopAction {
      static $commandOptions = { commandName: 'top' }
    }
    const loader = new ActionCommandsLoader('/tmp')
    const meta = loader.serialize(TopAction as any)
    assert.isNull(meta.namespace)
    assert.equal(meta.commandName, 'top')
  })
})

test.group('ActionCommandsLoader — getCommand', () => {
  test('returns null when no command matches the filePath', async ({ assert }) => {
    const loader = new ActionCommandsLoader('/tmp')
    const result = await loader.getCommand({
      commandName: 'nope',
      filePath: 'unknown.js',
    } as any)
    assert.isNull(result)
  })
})

test.group('ActionCommandsLoader — getMetaData', () => {
  test('discovers .js actions implementing AsCommand and skips others', async ({ fs, assert }) => {
    await fs.create(
      'app/actions/send_email_action.js',
      [
        'export default class SendEmailAction {',
        "  static $commandOptions = { commandName: 'mails:send' }",
        '  asCommand() {}',
        '}',
      ].join('\n')
    )

    await fs.create(
      'app/actions/no_command_action.js',
      'export default class NoCommandAction {}\n'
    )

    await fs.create(
      'app/actions/_internal_action.js',
      [
        'export default class InternalAction {',
        '  asCommand() {}',
        '}',
      ].join('\n')
    )

    await fs.create(
      'app/actions/types.d.ts',
      'export type Foo = string\n'
    )

    const dir = fileURLToPath(new URL('app/actions', fs.baseUrl))
    const loader = new ActionCommandsLoader(dir)

    const metadata = await loader.getMetaData()

    assert.lengthOf(metadata, 1)
    assert.equal(metadata[0].commandName, 'mails:send')
    assert.equal(metadata[0].filePath, 'send_email_action.js')
  })

  test('returns an empty list when the directory does not exist', async ({ assert }) => {
    const loader = new ActionCommandsLoader('/this/does/not/exist')
    const metadata = await loader.getMetaData()
    assert.deepEqual(metadata, [])
  })
})
