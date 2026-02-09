import { VineValidator } from '@vinejs/vine'
import { TypeLoaderFn } from 'openapi-metadata'

// Never returns a valid schema so that built-in Vine loader is used
export const CustomVineLoader: TypeLoaderFn = async (context, value) => {
  if (value instanceof VineValidator) {
    context.logger.warn('Custom vine loader triggered')
  }

  return undefined
}
