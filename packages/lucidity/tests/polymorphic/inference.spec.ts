import { test } from '@japa/runner'
import { type ApplicationService } from '@adonisjs/core/types'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { type HasMany } from '@adonisjs/lucid/types/relations'
import { morphMany } from '../../src/polymorphic/main.ts'
import { setupDatabase } from '../helpers.ts'

class Sticker extends BaseModel {
  static table = 'stickers'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare label: string

  @column()
  declare stickableType: string | null

  @column()
  declare stickableId: number | null
}

class Widget extends BaseModel {
  static table = 'widgets'

  @column({ isPrimary: true })
  declare id: number

  // Sticker has no inverse morphTo, so the morph name cannot be inferred.
  @morphMany(() => Sticker)
  declare stickers: HasMany<typeof Sticker>
}

test.group('Polymorphic name inference', (group) => {
  let app: ApplicationService

  group.setup(async () => {
    const result = await setupDatabase({
      client: 'sqlite',
      connection: { filename: ':memory:' },
    })
    app = result.app
  })

  group.teardown(async () => {
    await app.terminate()
  })

  test('throws a helpful error when the morph name cannot be inferred', ({ expect }) => {
    const widget = new Widget()
    expect(() => (widget as any).related('stickers')).toThrow(/infer the morph name/)
  })
})
