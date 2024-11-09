import { HttpContext } from '@adonisjs/core/http'
import { AuthChecker } from 'type-graphql'
import { Bouncer } from '@adonisjs/bouncer'
import { BouncerAbility } from '@adonisjs/bouncer/types'
import { UnavailableFeatureError } from './errors/unavailable_feature.js'

export const authChecker: AuthChecker<HttpContext, BouncerAbility<any>> = async (
  { context },
  abilities
) => {
  if (!('auth' in context)) {
    throw new UnavailableFeatureError(
      `You tried to use Authentication features but no authenticator is available in HttpContext.`
    )
  }

  const auth = context.auth as any
  const isAuthenticated = await auth.check()

  if (!isAuthenticated) {
    return false
  }

  if (abilities) {
    if (!('bouncer' in context)) {
      throw new UnavailableFeatureError(
        `You tried to use Authorization features (Bouncer) but bouncer is not available in HttpContext.`
      )
    }

    const bouncer = context.bouncer as Bouncer<any>
    for (const ability of abilities) {
      if (await bouncer.denies(ability)) {
        return false
      }
    }
  }

  return true
}
