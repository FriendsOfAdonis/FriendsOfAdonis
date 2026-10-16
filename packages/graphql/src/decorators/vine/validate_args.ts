import { type VineValidator } from '@vinejs/vine'
import { type SchemaTypes } from '@vinejs/vine/types'
import { createMethodMiddlewareDecorator } from 'type-graphql'

export function validateArgs(schema: VineValidator<SchemaTypes, undefined>) {
  return createMethodMiddlewareDecorator(async ({ args }, next) => {
    await schema.validate(args, { meta: undefined })
    return next()
  })
}
