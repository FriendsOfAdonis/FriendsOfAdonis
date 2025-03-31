import { test } from '@japa/runner'
import { parseModel } from '../src/index.js'
import { globby } from 'globby'
import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'
import { LucidParserError } from '../src/errors.js'

async function loadDataset() {
  const resultFiles = await globby('./fixtures/data/*.json', {
    cwd: import.meta.dirname,
  })

  return resultFiles.map((resultPath) => ({
    title: basename(resultPath),
    resultPath: new URL(resultPath, import.meta.url),
    modulePath: new URL(resultPath.replace('.json', '.ts'), import.meta.url),
  }))
}

const dataset = await loadDataset()

test.group('parseModel', () => {
  test('throw when no default export', async ({ assert }) => {
    await assert.rejects(async () => {
      await parseModel(import.meta.resolve('./fixtures/no_export.js'))
    }, LucidParserError as any)
  })

  test('dataset - {title}')
    .with(dataset)
    .run(async ({ assert }, { resultPath, modulePath }) => {
      const module = await parseModel(modulePath)
      const result = await readFile(resultPath, 'utf8').then((r) => JSON.parse(r))
      assert.deepEqual(module, result)
    })
})
