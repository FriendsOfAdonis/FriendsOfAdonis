import { assert } from '@japa/assert'
import { expect } from '@japa/expect'
import { expectTypeOf } from '@japa/expect-type'
import { fileSystem } from '@japa/file-system'
import { configure, processCLIArgs, run } from '@japa/runner'
import { BASE_URL } from '../tests/helpers.js'

processCLIArgs(process.argv.splice(2))

configure({
  files: ['tests/**/*.spec.ts', 'tests/**/*.spec.tsx'],
  plugins: [assert(), expect(), expectTypeOf(), fileSystem({ basePath: BASE_URL })],
})

run()
