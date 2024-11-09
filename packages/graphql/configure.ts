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
import { readPackageJSON, writePackageJSON } from 'pkg-types'

export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  await codemods.updateRcFile((rcFile) => {
    rcFile.addProvider('@foadonis/graphql/graphql_provider')
  })

  await codemods.makeUsingStub(stubsRoot, 'config/graphql.stub', {})

  await updatePackageJson(command)
}

async function updatePackageJson(command: ConfigureCommand) {
  const path = command.app.makePath('package.json')
  const packageJson = await readPackageJSON(path)

  packageJson.imports = {
    ...packageJson.imports,
    '#graphql/*': './app/graphql/*.js',
  }

  await writePackageJSON(path, packageJson)
}
