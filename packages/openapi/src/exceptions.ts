import { createError } from '@adonisjs/core/exceptions'

export const E_INVALID_API_SCHEMA = createError<
  [position: string, className: string, propertyKey: string]
>('You tried to use @ApiSchema with an invalid %s schema on %s.%s', 'E_INVALID_API_SCHEMA')
