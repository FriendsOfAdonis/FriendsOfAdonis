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
import string from '@adonisjs/core/helpers/string'
import { stubsRoot } from './stubs/main.js'

type EngineConfig = {
  name: string
  dependencies: string[]
  envVars: Record<string, string>
  envValidation: Record<string, string>
}

const ENGINES: Record<string, EngineConfig> = {
  algolia: {
    name: 'Algolia',
    dependencies: ['algoliasearch'],
    envVars: {
      ALGOLIA_APP_ID: '',
      ALGOLIA_API_KEY: '',
    },
    envValidation: {
      ALGOLIA_APP_ID: `Env.schema.string()`,
      ALGOLIA_API_KEY: `Env.schema.string()`,
    },
  },
  meilisearch: {
    name: 'Meilisearch',
    dependencies: ['meilisearch'],
    envVars: {
      MEILISEARCH_HOST: ``,
      MEILISEARCH_API_KEY: ``,
    },
    envValidation: {
      MEILISEARCH_HOST: `Env.schema.string({ format: 'host' })`,
      MEILISEARCH_API_KEY: `Env.schema.string.optional()`,
    },
  },
  typesense: {
    name: 'Typesense',
    dependencies: ['typesense'],
    envVars: {
      TYPESENSE_NODE_URL: ``,
      TYPESENSE_API_KEY: ``,
    },
    envValidation: {
      TYPESENSE_NODE_URL: `Env.schema.string({ format: 'host' })`,
      TYPESENSE_API_KEY: `Env.schema.string()`,
    },
  },
}

export async function configure(command: ConfigureCommand) {
  let engineName: string | undefined = command.parsedFlags.engine
  let shouldInstallPackages: boolean | undefined = command.parsedFlags.install

  if (engineName === undefined) {
    engineName = await command.prompt.choice(
      'Select the Search engine you want to use',
      Object.entries(ENGINES).map(([key, value]) => ({
        name: key,
        message: value.name,
      })),
      { validate: (value) => !!value }
    )
  }

  const engine = ENGINES[engineName!]

  if (!engine) {
    command.logger.error(
      `The selected search engine "${engineName}" is invalid. Select one from: ${string.sentence(
        Object.values(ENGINES).map((e) => e.name)
      )}`
    )
    command.exitCode = 1
    return
  }

  if (shouldInstallPackages === undefined) {
    shouldInstallPackages = await command.prompt.confirm(
      'Do you want to install additional packages required by "@foadonis/magnify" and the selected search engine?'
    )
  }

  const codemods = await command.createCodemods()

  await codemods.updateRcFile((rcFile) => {
    rcFile.addCommand('@foadonis/magnify/commands')
    rcFile.addProvider('@foadonis/magnify/magnify_provider')
  })

  await codemods.makeUsingStub(stubsRoot, `config/${engineName}.stub`, {})

  await codemods.defineEnvValidations({
    variables: engine.envValidation,
    leadingComment: 'Variables for configuring Magnify search engine',
  })

  await codemods.defineEnvVariables(engine.envVars)

  if (shouldInstallPackages) {
    await codemods.installPackages(
      engine.dependencies.map((name) => ({
        name,
        isDevDependency: false,
      }))
    )
  }

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
