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

import ConfigureCommand from '@adonisjs/core/commands/configure'
import { readFile, writeFile } from 'node:fs/promises'

export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  await codemods.updateRcFile((rcFile) => {
    rcFile.addCommand('@foadonis/crypt/commands')
  })

  await updateEnvFile(command)

  logSuccess(command)
}

async function updateEnvFile(command: ConfigureCommand) {
  try {
    const path = command.app.startPath('env.ts')
    const content = await readFile(command.app.startPath('env.ts')).then((r) => r.toString())
    await writeFile(path, `import '@foadonis/crypt'\n${content}`)
  } catch (e) {
    command.logger.warning(
      'An error occured when injecting crypt in `start/env.ts`. You might have to do it manually.'
    )
  }
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
