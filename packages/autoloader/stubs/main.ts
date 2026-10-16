import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export const stubsRoot = dirname(fileURLToPath(import.meta.url))
