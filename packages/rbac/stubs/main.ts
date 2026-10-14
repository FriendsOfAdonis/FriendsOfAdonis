import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Absolute path to the directory holding the package stubs.
 */
export const stubsRoot = dirname(fileURLToPath(import.meta.url))
