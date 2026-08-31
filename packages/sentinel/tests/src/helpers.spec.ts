import { test } from '@japa/runner'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { primaryKeyOf } from '../../src/helpers.ts'

class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column()
  declare password: string
}

test.group('Helpers | primaryKeyOf', () => {
  test('return the primary key of a persisted row', ({ assert }) => {
    const user = new User()
    user.id = 1

    assert.equal(primaryKeyOf(user, 'generate an OTP for'), 1)
  })

  test('refuse a row without primary key, naming the intent and the model', ({ assert }) => {
    const user = new User()

    assert.throws(
      () => primaryKeyOf(user, 'generate an OTP for'),
      RuntimeException,
      'Cannot generate an OTP for an unsaved "User": the primary key is empty'
    )
  })

  /**
   * An unsaved row still carries its plain attributes, a password
   * not hashed yet among them. They must never end up in the logs.
   */
  test('never dump the attributes of the row in the error', ({ assert }) => {
    const user = new User()
    user.fill({ email: 'jane@example.com', password: 'plain-text-secret' })

    let message = ''
    try {
      primaryKeyOf(user, 'generate an OTP for')
    } catch (error) {
      message = (error as Error).message
    }

    assert.equal(message, 'Cannot generate an OTP for an unsaved "User": the primary key is empty')
    assert.notInclude(message, 'plain-text-secret')
    assert.notInclude(message, 'jane@example.com')
  })
})
