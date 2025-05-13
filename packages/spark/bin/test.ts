import { assert } from '@japa/assert'
import { expect } from '@japa/expect'
import { expectTypeOf } from '@japa/expect-type'
import { browserClient } from '@japa/browser-client'
import { fileSystem } from '@japa/file-system'
import { configure, processCLIArgs, run } from '@japa/runner'
import { BASE_URL } from '../tests/helpers.js'

processCLIArgs(process.argv.splice(2))

configure({
  suites: [
    {
      name: 'unit',
      files: ['tests/unit/**/*.spec.ts', 'tests/unit/**/*.spec.tsx'],
    },
    {
      name: 'e2e',
      files: ['tests/e2e/**/*.spec.ts', 'tests/e2e/**/*.spec.tsx'],
      timeout: 20_000,
    },
  ],
  plugins: [
    assert(),
    expect(),
    expectTypeOf(),
    fileSystem({ basePath: BASE_URL }),
    browserClient({
      runInSuites: ['e2e'],
      contextOptions: {
        baseURL: 'http://localhost:3333',
      },
    }),
  ],
})

run()
