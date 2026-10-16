/**
 * This script is used to switch yarn catalog.
 * Used for testing against different dependency versions.
 */

import { readFile, writeFile } from 'node:fs/promises'
import * as YAML from 'yaml'

const [, , catalogName] = process.argv

if (!catalogName) {
  throw new Error(`Catalog argument is not defined`)
}

const yarnrcPath = new URL('../../.yarnrc.yml', import.meta.url)
const yarnrc = await readFile(yarnrcPath, 'utf8').then((content) => YAML.parse(content))

const catalog = yarnrc.catalogs[catalogName]

for (const [key, value] of Object.entries(catalog)) {
  yarnrc.catalog[key] = value
}

await writeFile(yarnrcPath, YAML.stringify(yarnrc))

console.log(`Switch to catalog "${catalogName}"`)
