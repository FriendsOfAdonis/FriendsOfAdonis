import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Absolute path to the stubs directory of the package
 */
export const stubsRoot = dirname(fileURLToPath(import.meta.url))
