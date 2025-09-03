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
import { Codemods } from '@adonisjs/core/ace/codemods'
import { BaseCommand } from '@adonisjs/core/ace'
import stringHelpers from '@adonisjs/core/helpers/string'

export const ENGINE_CONFIGURATIONS = [
  {
    id: 'algolia',
    name: 'Algolia',
    description: 'Closed-source Search Engine',
    dependencies: ['algoliasearch'],
    variables: [
      {
        name: 'Your App Id found in your Application settings (under API Keys)',
        key: 'ALGOLIA_APP_ID',
        schema: 'Env.schema.string()',
      },
      {
        name: 'Your API Key found in your Application settings (under API Keys)',
        key: 'ALGOLIA_API_KEY',
        schema: 'Env.schema.string()',
      },
    ],
  },
  {
    id: 'meilisearch',
    name: 'Meilisearch',
    description: 'Open-source Search Engine written in Rust',
    variables: [
      {
        name: 'URL to your Meilisearch instance (eg. http://localhost:7700)',
        key: 'MEILISEARCH_HOST',
        schema: `Env.schema.string({ format: 'url' })`,
      },
      {
        name: 'API Key to authenticate against Meilisearch',
        key: 'MEILISEARCH_API_KEY',
        schema: 'Env.schema.string()',
      },
    ],
    dependencies: ['meilisearch'],
  },
  {
    id: 'typesense',
    name: 'Typesense',
    description: 'Open-source Search Engine written in C++',
    variables: [
      {
        name: 'Host of your Typesense instance (eg. http://localhost:8108)',
        key: 'TYPESENSE_NODE_URL',
        schema: `Env.schema.string({ format: 'url' })`,
      },
      {
        name: 'API Key to authenticate against Typesense',
        key: 'TYPESENSE_API_KEY',
        schema: 'Env.schema.string()',
      },
    ],
    dependencies: ['typesense'],
  },
]

export type EngineConfiguration = (typeof ENGINE_CONFIGURATIONS)[number]

export async function installDependencies(
  command: BaseCommand,
  codemods: Codemods,
  configuration: EngineConfiguration
) {
  const shouldInstall = await command.prompt.confirm(
    `Do you want to install ${stringHelpers.sentence(configuration.variables)}?`,
    { name: 'install' }
  )

  if (!shouldInstall) return

  await codemods.installPackages(
    configuration.dependencies.map((p) => ({
      isDevDependency: false,
      name: p,
    }))
  )
}

export async function configureEnvVariables(
  command: BaseCommand,
  codemods: Codemods,
  configuration: EngineConfiguration
) {
  const variables: Record<string, string> = {}

  for (const variable of configuration.variables) {
    const result = await command.prompt.ask(variable.key, {
      name: variable.key,
      hint: variable.name,
    })

    variables[variable.key] = result
  }

  await codemods.defineEnvVariables(variables)
}

export async function configureEnvValidations(
  codemods: Codemods,
  configuration: EngineConfiguration
) {
  await codemods.defineEnvValidations({
    leadingComment: `Variables for configuring ${configuration.name} Search Engine`,
    variables: configuration.variables.reduce(
      (a, v) => ({
        ...a,
        [v.key]: v.schema,
      }),
      {}
    ),
  })
}

export async function configure(command: ConfigureCommand) {
  let engineName = command.parsedFlags.engine

  if (engineName === undefined) {
    engineName = await command.prompt.choice(
      'What Search Engine do you want to configure?',
      ENGINE_CONFIGURATIONS.map((engine) => ({
        name: engine.id,
        message: engine.name,
        hint: engine.description,
      })),
      {
        name: 'engine',
      }
    )
  }

  const configuration = ENGINE_CONFIGURATIONS.find((e) => e.id === engineName)

  if (!configuration) {
    throw new Error(
      `The Search Engine ${engineName} is not valid (available: ${stringHelpers.sentence(ENGINE_CONFIGURATIONS.map((e) => e.id))})`
    )
  }

  const codemods = await command.createCodemods()

  await codemods.updateRcFile((rcFile) => {
    rcFile.addCommand('@foadonis/magnify/commands')
    rcFile.addProvider('@foadonis/magnify/magnify_provider')
  })

  await codemods.makeUsingStub(stubsRoot, `config/${engineName}.stub`, {})

  await configureEnvValidations(codemods, configuration)
  await configureEnvVariables(command, codemods, configuration)
  await installDependencies(command, codemods, configuration)

  logSuccess(command)
}

function logSuccess(command: ConfigureCommand) {
  const c = command.colors
  const foadonis = c.bold('Friends Of Adonis')
  const name = c.yellow('@foadonis/magnify')
  command.logger.log('')
  command.logger.log(c.green('╭───────────────────────────────────────╮'))
  command.logger.log(c.green(`│ ${foadonis} | ${name} │`))
  command.logger.log(c.green('╰───────────────────────────────────────╯'))
  command.logger.log('╭')
  command.logger.log('│ Welcome to @foadonis/magnify!')
  command.logger.log('│ ')
  command.logger.log('│ Get started')
  command.logger.log('│ ↪  Docs: https://friendsofadonis.com/docs/magnify')
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
