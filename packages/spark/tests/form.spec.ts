import { test } from '@japa/runner'
import vine, { errors } from '@vinejs/vine'
import { Form } from '../src/form/base_form.js'

test.group('Form', () => {
  test('validate should validate valid values', async ({ expect }) => {
    const schema = vine.compile(
      vine.object({
        email: vine.string().email(),
      })
    )

    const form = Form(schema, { email: '' })

    form.email = 'spark@friendsofadonis.com'

    const data = await form.validate()

    expect(data.email).toBe('spark@friendsofadonis.com')
    expect(form.email).toBe('spark@friendsofadonis.com')
  })

  test('validate should throw with invalide value', async ({ expect }) => {
    const schema = vine.compile(
      vine.object({
        email: vine.string().email(),
      })
    )

    const form = Form(schema, { email: '' })

    form.email = 'spark'

    await expect(() => form.validate()).rejects.toBeInstanceOf(errors.E_VALIDATION_ERROR)

    expect(form.error('email')).toEqual({
      field: 'email',
      message: 'The email field must be a valid email address',
      rule: 'email',
    })
  })

  test('should reset values', async ({ expect }) => {
    const schema = vine.compile(
      vine.object({
        email: vine.string().email(),
      })
    )

    const form = Form(schema, { email: 'defaultvalue' })

    expect(form.email).toBe('defaultvalue')

    form.email = 'newvalue'
    expect(form.email).toBe('newvalue')

    form.reset()
    expect(form.email).toBe('defaultvalue')
  })

  test('should make form dirty', async ({ expect }) => {
    const schema = vine.compile(
      vine.object({
        email: vine.string().email(),
      })
    )

    const form = Form(schema, { email: 'defaultvalue' })

    expect(form.isDirty()).toBe(false)

    form.email = 'contact@friendsofadonis.com'

    expect(form.isDirty()).toBe(true)

    await form.validate()

    expect(form.isDirty()).toBe(false)
  })
})
