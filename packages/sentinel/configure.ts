import type ConfigureCommand from '@adonisjs/core/commands/configure'
import { stubsRoot } from './stubs/main.ts'

/**
 * Configures the package
 */
export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  /**
   * Register the service provider
   */
  await codemods.updateRcFile((rcFile) => {
    rcFile.addProvider('@foadonis/sentinel/sentinel_provider')
  })

  /**
   * Publish the config file
   */
  await codemods.makeUsingStub(stubsRoot, 'config/sentinel.stub', {})

  logSuccess(command)
}

/**
 * Prints the welcome message with the links to the documentation
 * and the repository
 */
function logSuccess(command: ConfigureCommand) {
  const c = command.colors
  const foadonis = c.bold('Friends Of Adonis')
  const name = c.yellow('@foadonis/sentinel')
  command.logger.log('')
  command.logger.log(c.green('╭────────────────────────────────────────╮'))
  command.logger.log(c.green(`│ ${foadonis} | ${name} │`))
  command.logger.log(c.green('╰────────────────────────────────────────╯'))
  command.logger.log('╭')
  command.logger.log('│ Welcome to @foadonis/sentinel!')
  command.logger.log('│ ')
  command.logger.log('│ Get started')
  command.logger.log('│ ↪  Docs: https://friendsofadonis.com/docs/sentinel')
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
