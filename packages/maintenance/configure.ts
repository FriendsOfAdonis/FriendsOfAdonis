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
import { stubsRoot } from './stubs/main.js'

export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  await codemods.updateRcFile((rcFile) => {
    rcFile.addCommand('@foadonis/maintenance/commands')
    rcFile.addProvider('@foadonis/maintenance/maintenance_provider')
  })

  await codemods.registerMiddleware('server', [
    {
      position: 'before',
      path: '@foadonis/maintenance/maintenance_middleware',
    },
  ])

  await codemods.makeUsingStub(stubsRoot, `config.stub`, {})
}
