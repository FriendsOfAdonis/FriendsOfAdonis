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

import type ConfigureCommand from '@adonisjs/core/commands/configure'
import { stubsRoot } from './stubs/main.js'
import { type Codemods } from '@adonisjs/core/ace/codemods'

export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  await codemods.updateRcFile((rcFile) => {
    rcFile.addProvider('@foadonis/openapi/openapi_provider')
  })

  await codemods.makeUsingStub(stubsRoot, 'config/openapi.stub', {})
  await codemods.makeUsingStub(stubsRoot, 'controllers/openapi_controller.stub', {})

  await updateRouteFile(command, codemods)

  logSuccess(command)
}

async function updateRouteFile(command: ConfigureCommand, codemods: Codemods) {
  const project = await codemods.getTsMorphProject()
  if (!project) return

  const path = command.app.startPath('routes.ts')
  const sourceFile = project.getSourceFile(path) ?? project.createSourceFile(path)
  if (!sourceFile) return

  sourceFile.addImportDeclarations([
    {
      moduleSpecifier: '#generated/controllers',
      namedImports: ['controllers'],
    },
    {
      moduleSpecifier: '@foadonis/openapi/services/main',
      defaultImport: 'openapi',
    },
  ])

  sourceFile.addStatements((writer) => {
    writer.writeLine(`openapi.registerController('/api/v1', controllers.OpenApi)`)
  })

  await sourceFile.save()
}

function logSuccess(command: ConfigureCommand) {
  const c = command.colors
  const foadonis = c.bold('Friends Of Adonis')
  const name = c.yellow('@foadonis/openapi')
  command.logger.log('')
  command.logger.log(c.green('╭───────────────────────────────────────╮'))
  command.logger.log(c.green(`│ ${foadonis} | ${name} │`))
  command.logger.log(c.green('╰───────────────────────────────────────╯'))
  command.logger.log('╭')
  command.logger.log('│ Welcome to @foadonis/openapi!')
  command.logger.log('│ ')
  command.logger.log('│ Get started')
  command.logger.log('│ ↪  Docs: https://friendsofadonis.com/docs/openapi')
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
