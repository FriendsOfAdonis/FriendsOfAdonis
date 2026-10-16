import { test } from '@japa/runner'
import { E_MISSING_SCOPE_IDENTIFIER } from '../../src/exceptions.ts'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { HasFeatures } from '../../src/mixins/has_feature.ts'

class FakeModel extends compose(BaseModel, HasFeatures) {
  @column({ isPrimary: true })
  declare id: string | number | undefined

  constructor(id?: string | number) {
    super()
    this.id = id
  }
}

test.group('HasFeatures mixin', () => {
  test('should return the primary key as the feature identifier', ({ assert }) => {
    assert.strictEqual(new FakeModel(42).toFeatureIdentifier(), 42)
    assert.strictEqual(new FakeModel('user-1').toFeatureIdentifier(), 'user-1')
  })

  test('should throw when the primary key is missing', ({ assert }) => {
    assert.throws(
      () => new FakeModel(undefined).toFeatureIdentifier(),
      E_MISSING_SCOPE_IDENTIFIER,
      'does not have a scope identifier'
    )
  })
})
