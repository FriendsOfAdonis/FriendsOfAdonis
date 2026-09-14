import { test } from '@japa/runner'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { Searchable } from '../../src/mixins/searchable.js'
import { type SearchableColumnName } from '../../src/types.js'

class ColumnConstrainedModel extends compose(BaseModel, Searchable) {
  static $columns = ['id', 'name'] as const

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare email: string
}

class ExtraColumnModel extends compose(BaseModel, Searchable) {
  static $columns = ['id', 'name', 'email'] as const

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string
}

test.group('Searchable columns', () => {
  test('prefer static $columns when the model defines them', ({ expectTypeOf }) => {
    expectTypeOf<SearchableColumnName<typeof ColumnConstrainedModel>>().toEqualTypeOf<
      'id' | 'name'
    >()
  })

  test('include names listed in $columns even if they are not attributes', ({ expectTypeOf }) => {
    expectTypeOf<SearchableColumnName<typeof ExtraColumnModel>>().toEqualTypeOf<'id' | 'name' | 'email'>()
  })
})
