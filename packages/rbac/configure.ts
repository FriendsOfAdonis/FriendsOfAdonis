import type ConfigureCommand from '@adonisjs/core/commands/configure'
import type { Codemods } from '@adonisjs/core/ace/codemods'
import { stubsRoot } from './stubs/main.ts'

/**
 * Migrations published by the configure hook, in the order they must run.
 */
const MIGRATIONS = ['create_roles_table', 'create_user_roles_table']

/**
 * Configures the package. Invoked by "node ace configure @foadonis/rbac".
 *
 * Creates the permissions definition, the "authorize" middleware and the
 * roles migrations, then registers the middleware as a named middleware.
 */
export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  await codemods.makeUsingStub(stubsRoot, 'start/permissions.stub', {})
  await codemods.makeUsingStub(stubsRoot, 'make/middleware/authorize.stub', {})

  await codemods.registerMiddleware('named', [
    {
      name: 'authorize',
      path: '#middleware/authorize_middleware',
    },
  ])

  await generateMigrations(command, codemods)

  logSuccess(command)
}

/**
 * Publishes the migrations. Each one gets its own timestamp so the roles
 * table is always created before the pivot table referencing it.
 */
async function generateMigrations(command: ConfigureCommand, codemods: Codemods) {
  const timestamp = Date.now()

  for (const [index, name] of MIGRATIONS.entries()) {
    await codemods.makeUsingStub(stubsRoot, `database/migrations/${name}.stub`, {
      filePath: command.app.migrationsPath(`${timestamp + index}_${name}.ts`),
    })
  }
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
