import vine from '@vinejs/vine'
import { type Infer } from '@vinejs/vine/types'

export const createPostValidator = vine.compile(
  vine.object({
    title: vine.string(),
  })
)

export const createUserValidator = vine.create({
  firstName: vine.string(),
  lastName: vine.string(),
  password: vine.string(),
})

export type CreateUserSchema = Infer<typeof createUserValidator>
