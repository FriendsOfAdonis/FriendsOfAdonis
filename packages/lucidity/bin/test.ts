import { assert } from '@japa/assert'
import { expect } from '@japa/expect'
import { expectTypeOf } from '@japa/expect-type'
import { configure, processCLIArgs, run } from '@japa/runner'

processCLIArgs(process.argv.splice(2))

configure({
  files: ['tests/**/*.spec.ts'],
  plugins: [assert(), expect(), expectTypeOf()],
  timeout: 30000,
})

run()
