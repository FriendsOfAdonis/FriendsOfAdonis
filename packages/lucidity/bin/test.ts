import 'reflect-metadata'

import { assert } from '@japa/assert'
import { fileSystem } from '@japa/file-system'
import { expect } from '@japa/expect'
import { configure, processCLIArgs, run } from '@japa/runner'
import { snapshot } from '@japa/snapshot'

const BASE_URL = new URL('../tests/tmp/', import.meta.url)

processCLIArgs(process.argv.splice(2))

configure({
  files: ['tests/**/*.spec.ts'],
  plugins: [assert(), expect(), snapshot(), fileSystem({ basePath: BASE_URL })],
  timeout: 30000,
})

run()
