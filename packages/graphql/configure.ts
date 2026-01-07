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
import { readPackageJSON, writePackageJSON } from 'pkg-types'

export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  await codemods.updateRcFile((rcFile) => {
    rcFile.addProvider('@foadonis/graphql/graphql_provider')
    rcFile.addCommand('@foadonis/graphql/commands')

    rcFile.addNamedImport('@foadonis/graphql', ['indexResolvers'])
    rcFile.addAssemblerHook('init', 'indexResolvers()', true)
  })

  const driver = await command.prompt.choice(
    'What driver do you want to use?',
    [
      {
        message: 'Apollo (@apollo/server)',
        name: 'apollo',
      },
      {
        message: 'Yoga (graphql-yoga)',
        name: 'yoga',
      },
    ],
    { name: 'driver' }
  )

  const shouldInstallPackages = await command.prompt.confirm(
    `Do you want to install additional packages required by "@foadonis/graphql"?`,
    { name: 'shouldInstallPackages' }
  )

  if (shouldInstallPackages) {
    await codemods.installPackages([
      {
        name: 'graphql',
        isDevDependency: false,
      },
      {
        name: 'graphql-scalars',
        isDevDependency: false,
      },
      {
        name: '@graphql-yoga/subscription',
        isDevDependency: false,
      },
      ...(driver === 'apollo'
        ? [
            {
              name: '@apollo/server',
              isDevDependency: false,
            },
          ]
        : []),
      ...(driver === 'yoga'
        ? [
            {
              name: 'graphql-yoga',
              isDevDependency: false,
            },
            {
              name: '@graphql-yoga/plugin-disable-introspection',
              isDevDependency: false,
            },
          ]
        : []),
    ])
  }

  await codemods.makeUsingStub(stubsRoot, `config/${driver}.stub`, {})
  await codemods.makeUsingStub(stubsRoot, 'make/resolver.stub', {
    name: 'demo',
  })

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

  logSuccess(command)
}

function logSuccess(command: ConfigureCommand) {
  const c = command.colors
  const foadonis = c.bold('Friends Of Adonis')
  const name = c.yellow('@foadonis/graphql')
  command.logger.log('')
  command.logger.log(c.green('╭───────────────────────────────────────╮'))
  command.logger.log(c.green(`│ ${foadonis} | ${name} │`))
  command.logger.log(c.green('╰───────────────────────────────────────╯'))
  command.logger.log('╭')
  command.logger.log('│ Welcome to @foadonis/graphql!')
  command.logger.log('│ ')
  command.logger.log('│ Get started')
  command.logger.log('│ ↪  Docs: https://friendsofadonis.com/docs/graphql')
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
