import { type HttpContext } from '@adonisjs/core/http'
import { createParameterDecorator, AuthenticationError } from 'type-graphql'
import { UnavailableFeatureError } from '../errors/unavailable_feature.js'

export function CurrentUser() {
  return createParameterDecorator<HttpContext>(async ({ context }) => {
    if (!('auth' in context)) {
      throw new UnavailableFeatureError(
        `You tried to use Authentication features (@CurrentUser) but no authenticator is available in HttpContext.`
      )
    }

    try {
      const auth = context.auth as any
      return auth.getUserOrFail()
    } catch {
      throw new AuthenticationError()
    }
  })
}
