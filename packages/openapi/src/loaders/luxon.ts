import { DateTime } from 'luxon'
import { type TypeLoaderFn } from '@martin.xyz/openapi-decorators/types'

export const LuxonTypeLoader: TypeLoaderFn = async (_context, value) => {
  if (value === DateTime) {
    return { type: 'string' }
  }
}
