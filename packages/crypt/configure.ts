/*
|--------------------------------------------------------------------------
| Configure hook
|--------------------------------------------------------------------------
|
| The configure hook is called when someone runs "node ace configure <package>"
| command. You are free to perform any operations inside this function to
| configure the package.
|
| To make things easier, you have access to the underlying "ConfigureCommand"
| instance and you can use codemods to modify the source files.
|
*/

import { type Codemods } from '@adonisjs/core/ace/codemods'
import type ConfigureCommand from '@adonisjs/core/commands/configure'

export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  await codemods.updateRcFile((rcFile) => {
    rcFile.addCommand('@foadonis/crypt/commands')
  })

  try {
    await prependRegister(codemods, command.app.startPath('env.ts'))
  } catch (e) {
    command.logger.warning(
      'An error occured when injecting crypt in `start/env.ts`. You might have to do it manually.'
    )
  }

  logSuccess(command)
}

async function prependRegister(codemods: Codemods, path: string) {
  const program = (await codemods.getTsMorphProject())!
  const source = program.getSourceFile(path)!

  source.addImportDeclaration({
    moduleSpecifier: '@foadonis/crypt/register',
  })

  await source.save()
}

function logSuccess(command: ConfigureCommand) {
  const c = command.colors
  const foadonis = c.bold('Friends Of Adonis')
  const name = c.yellow('@foadonis/crypt')
  command.logger.log('')
  command.logger.log(c.green('╭─────────────────────────────────────╮'))
  command.logger.log(c.green(`│ ${foadonis} | ${name} │`))
  command.logger.log(c.green('╰─────────────────────────────────────╯'))
  command.logger.log('╭')
  command.logger.log('│ Welcome to @foadonis/crypt!')
  command.logger.log('│ ')
  command.logger.log('│ Get started')
  command.logger.log('│ ↪  Docs: https://friendsofadonis.com/docs/crypt')
  command.logger.log('│ ↪  Start: node ace crypt:init')
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
