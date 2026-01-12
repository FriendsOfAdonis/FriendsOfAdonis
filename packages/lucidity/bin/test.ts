import 'reflect-metadata'

import { assert } from '@japa/assert'
import { fileSystem } from '@japa/file-system'
import { expect } from '@japa/expect'
import { configure, processCLIArgs, run } from '@japa/runner'
import { BASE_URL } from '../tests/helpers.js'
import { snapshot } from '@japa/snapshot'

processCLIArgs(process.argv.splice(2))

configure({
  files: ['tests/**/*.spec.ts'],
  plugins: [assert(), expect(), snapshot(), fileSystem({ basePath: BASE_URL })],
})

run()
