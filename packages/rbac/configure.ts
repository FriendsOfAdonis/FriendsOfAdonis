import type ConfigureCommand from '@adonisjs/core/commands/configure'
import { stubsRoot } from './stubs/main.ts'

/**
 * Configures the package. Invoked by "node ace configure @foadonis/rbac".
 *
 * Creates the permissions and roles definition, the "authorize"
 * middleware and the migration adding the "roles" and "permissions"
 * columns to the users table, then registers the middleware as a named
 * middleware.
 */
export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  await codemods.makeUsingStub(stubsRoot, 'start/rbac.stub', {})
  await codemods.makeUsingStub(stubsRoot, 'make/middleware/authorize.stub', {})

  await codemods.registerMiddleware('named', [
    {
      name: 'authorize',
      path: '#middleware/authorize_middleware',
    },
  ])

  await codemods.makeUsingStub(
    stubsRoot,
    'database/migrations/add_rbac_columns_to_users_table.stub',
    {
      filePath: command.app.migrationsPath(`${Date.now()}_add_rbac_columns_to_users_table.ts`),
    }
  )

  logSuccess(command)
}

/**
 * Prints the welcome message.
 */
function logSuccess(command: ConfigureCommand) {
  const c = command.colors
  const foadonis = c.bold('Friends Of Adonis')
  const name = c.yellow('@foadonis/rbac')
  command.logger.log('')
  command.logger.log(c.green('╭────────────────────────────────────╮'))
  command.logger.log(c.green(`│ ${foadonis} | ${name} │`))
  command.logger.log(c.green('╰────────────────────────────────────╯'))
  command.logger.log('╭')
  command.logger.log('│ Welcome to @foadonis/rbac!')
  command.logger.log('│ ')
  command.logger.log('│ Get started')
  command.logger.log('│ ↪  Docs: https://friendsofadonis.com/docs/rbac')
  command.logger.log('│ ')
  command.logger.log(
    `│ ${c.yellow('⭐ Give a star: https://github.com/FriendsOfAdonis/FriendsOfAdonis')}`
  )
  command.logger.log('╰')
  command.logger.log('')
  command.logger.log(
    c.grey(
      c.italic(
        'I am looking for maintainers to help me grow and maintain the FriendsOfAdonis ecosystem.\nContact me on discord: "@kerwan."'
      )
    )
  )
}
