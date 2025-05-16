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
import { readPackageJSON, readTSConfig, writePackageJSON, writeTSConfig } from 'pkg-types'

import ConfigureCommand from '@adonisjs/core/commands/configure'
import { stubsRoot } from './stubs/main.js'
import { Codemods } from '@adonisjs/core/ace/codemods'

async function updatePackageJSON(command: ConfigureCommand) {
  const packageJson = await readPackageJSON(command.app.makePath())

  packageJson.imports = {
    ...packageJson.imports,
    '#spark/*': './app/spark/*.js',
  }

  await writePackageJSON(command.app.makePath('package.json'), packageJson)
}

async function updateTSConfig(command: ConfigureCommand) {
  const tsconfig = await readTSConfig(command.app.makePath())

  tsconfig.compilerOptions = {
    ...tsconfig.compilerOptions,
    jsx: 'react-jsx',
    jsxImportSource: '@foadonis/spark',
  }

  await writeTSConfig(command.app.makePath('tsconfig.json'), tsconfig)
}

async function makeStubs(codemods: Codemods) {
  await codemods.makeUsingStub(stubsRoot, 'config/spark.stub', {})
  await codemods.makeUsingStub(stubsRoot, 'components/root_layout.stub', {})
  await codemods.makeUsingStub(stubsRoot, 'resources/js/app.stub', {})
  await codemods.makeUsingStub(stubsRoot, 'controllers/welcome_controller.stub', {})
}

async function updateRcFile(codemods: Codemods) {
  await codemods.updateRcFile((rcFile) => {
    rcFile.addCommand('@foadonis/spark/commands')
    rcFile.addProvider('@foadonis/spark/provider')
  })
}

export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  await updateRcFile(codemods)
  await makeStubs(codemods)
  await updatePackageJSON(command)
  await updateTSConfig(command)

  logSuccess(command)
}

function logSuccess(command: ConfigureCommand) {
  const c = command.colors
  const foadonis = c.bold('Friends Of Adonis')
  const name = c.yellow('@foadonis/spark')
  command.logger.log('')
  command.logger.log(c.green('╭─────────────────────────────────────╮'))
  command.logger.log(c.green(`│ ${foadonis} | ${name} │`))
  command.logger.log(c.green('╰─────────────────────────────────────╯'))
  command.logger.log('╭')
  command.logger.log('│ Welcome to @foadonis/crypt!')
  command.logger.log('│ ')
  command.logger.log('│ Get started')
  command.logger.log('│ ↪  Docs: https://friendsofadonis.com/docs/spark')
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
