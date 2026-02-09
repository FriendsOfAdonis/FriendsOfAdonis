import 'reflect-metadata'
import { assert } from '@japa/assert'
import { expectTypeOf } from '@japa/expect-type'
import { processCLIArgs, configure, run } from '@japa/runner'
import { fileSystem } from '@japa/file-system'
import { BASE_URL } from '../tests/helpers.js'

processCLIArgs(process.argv.slice(2))
configure({
  suites: [
    {
      name: 'units',
      files: ['tests/units/**/*.spec.ts'],
    },
    {
      name: 'integration',
      files: ['tests/integration/**/*.spec.ts'],
    },
    {
      name: 'functional',
      files: ['tests/functional/**/*.spec.ts'],
    },
  ],
  plugins: [assert(), expectTypeOf(), fileSystem({ basePath: BASE_URL, autoClean: false })],
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
