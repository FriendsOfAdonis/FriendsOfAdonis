import { type HttpContext } from '@adonisjs/core/http'
import { type AuthChecker } from 'type-graphql'
import { type Bouncer } from '@adonisjs/bouncer'
import { type BouncerAbility } from '@adonisjs/bouncer/types'
import { UnavailableFeatureError } from './errors/unavailable_feature.js'
import { type AuthorizationRule, type PolicyAuthorizationRule } from './types.js'

function isPolicyRule(rule: AuthorizationRule): rule is PolicyAuthorizationRule {
  return typeof rule === 'object' && rule !== null && 'policy' in rule && 'method' in rule
}

function isAbility(rule: AuthorizationRule): rule is BouncerAbility<any> {
  return typeof rule === 'object' && rule !== null && 'execute' in rule && 'original' in rule
}

export const authChecker: AuthChecker<HttpContext, AuthorizationRule> = async (
  { root, context },
  rules
) => {
  const auth = 'auth' in context ? (context.auth as any) : undefined
  const isAuthenticated = auth ? await auth.check() : false

  if (!rules || rules.length === 0) {
    if (!auth) {
      throw new UnavailableFeatureError(
        `You tried to use Authentication features but no authenticator is available in HttpContext.`
      )
    }

    return isAuthenticated
  }

  if (!('bouncer' in context)) {
    throw new UnavailableFeatureError(
      `You tried to use Authorization features (Bouncer) but bouncer is not available in HttpContext.`
    )
  }

  const bouncer = context.bouncer as Bouncer<any>

  for (const rule of rules) {
    let denied: boolean

    if (isPolicyRule(rule)) {
      denied = await bouncer.with(rule.policy).denies(rule.method as never, root)
    } else if (typeof rule === 'string' || isAbility(rule)) {
      denied = await bouncer.denies(rule as BouncerAbility<any>, root)
    } else {
      throw new TypeError(
        `Invalid authorization requirement passed to @Authorized. Expected a Bouncer ability, the name of a pre-registered ability or a policy class with a method name.`
      )
    }

    if (denied) {
      return false
    }
  }

  return true
}
