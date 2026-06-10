import { test } from '@japa/runner'
import { createApplication } from '../helpers.js'
import MakeFeatureCommand from '../../commands/make_feature.ts'

test.group('MakeFeatureCommand', () => {
  test('should create a feature class in app/features', async ({ assert, fs }) => {
    const { ace } = await createApplication()

    await fs.create('adonisrc.ts', `export default defineConfig({})`)

    const command = await ace.create(MakeFeatureCommand, ['new_checkout'])
    await command.exec()

    command.assertSucceeded()

    await assert.fileExists('app/features/new_checkout_feature.ts')
    await assert.fileContains(
      'app/features/new_checkout_feature.ts',
      `import { BaseFeature } from '@foadonis/flick'`
    )
    await assert.fileContains(
      'app/features/new_checkout_feature.ts',
      'export default class NewCheckoutFeature extends BaseFeature'
    )
  })

  test('should normalize the name and suffix', async ({ assert, fs }) => {
    const { ace } = await createApplication()

    await fs.create('adonisrc.ts', `export default defineConfig({})`)

    const command = await ace.create(MakeFeatureCommand, ['BetaBannerFeature'])
    await command.exec()

    command.assertSucceeded()

    await assert.fileExists('app/features/beta_banner_feature.ts')
    await assert.fileContains(
      'app/features/beta_banner_feature.ts',
      'export default class BetaBannerFeature extends BaseFeature'
    )
  })
})
