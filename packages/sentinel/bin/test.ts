import { assert } from '@japa/assert'
import { fileSystem } from '@japa/file-system'
import { configure, processCLIArgs, run } from '@japa/runner'
import type { ApplicationService } from '@adonisjs/core/types'
import { setApp } from '@adonisjs/core/services/app'
import { AppFactory } from '@adonisjs/core/factories/app'
import { BASE_URL } from '../tests/helpers.ts'

/*
|--------------------------------------------------------------------------
| Register an application
|--------------------------------------------------------------------------
|
| The mixins read the services of the package, which register a "booted"
| hook on the global application when imported. The tests give their
| managers explicitly, so the application only has to exist: it is never
| booted and the services stay undefined.
|
*/
setApp(new AppFactory().create(BASE_URL, () => {}) as ApplicationService)

/*
|--------------------------------------------------------------------------
| Configure tests
|--------------------------------------------------------------------------
|
| The configure method accepts the configuration to configure the Japa
| tests runner.
|
| The first method call "processCLIArgs" process the command line arguments
| and turns them into a config object. Using this method is not mandatory.
|
| Please consult japa.dev/runner-config for the config docs.
*/
processCLIArgs(process.argv.splice(2))

configure({
  files: ['tests/**/*.spec.ts'],
  plugins: [assert(), fileSystem({ basePath: BASE_URL })],
})

/*
|--------------------------------------------------------------------------
| Run tests
|--------------------------------------------------------------------------
|
| The following "run" method is required to execute all the tests.
|
*/
run()
