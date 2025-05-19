import { assert } from '@japa/assert'
import { fileSystem } from '@japa/file-system'
import { configure, processCLIArgs, run } from '@japa/runner'
import { BASE_URL } from '../tests/helpers.js'

processCLIArgs(process.argv.splice(2))

configure({
  files: ['tests/**/*.spec.ts'],
  plugins: [assert(), fileSystem({ basePath: BASE_URL })],
})

run()
