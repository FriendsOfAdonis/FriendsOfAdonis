import 'reflect-metadata'

import { assert } from '@japa/assert'
import { fileSystem } from '@japa/file-system'
import { expect } from '@japa/expect'
import { expectTypeOf } from '@japa/expect-type'
import { configure, processCLIArgs, run } from '@japa/runner'
import { apiClient } from '@japa/api-client'
import { BASE_URL, lazyApp, pluginOptions } from '../tests/helpers.js'
import { graphqlApiClient } from '../src/plugins/api_client/main.js'

processCLIArgs(process.argv.splice(2))

configure({
  files: ['tests/**/*.spec.ts'],
  plugins: [
    assert(),
    expect(),
    expectTypeOf(),
    fileSystem({ basePath: BASE_URL }),
    apiClient('http://localhost:3333'),
    graphqlApiClient(lazyApp, pluginOptions),
  ],
})

run()
