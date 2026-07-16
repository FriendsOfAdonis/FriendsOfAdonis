import { createError } from '@poppinss/utils'

export const E_NOT_IMPLEMENTED_EXCEPTION = createError<
  [action: string, mixin: string, method: string]
>('The action %s uses %s but does not implement the method %s', 'E_NOT_IMPLEMENTED_EXCEPTION')
