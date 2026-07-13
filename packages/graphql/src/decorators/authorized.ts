import { Authorized as BaseAuthorized } from 'type-graphql'
import { type BouncerAbility, type GetPolicyMethods } from '@adonisjs/bouncer/types'
import { type Constructor } from '@adonisjs/core/types/common'
import { type AuthorizationRule } from '../types.js'

type MethodPropClassDecorator = PropertyDecorator & MethodDecorator & ClassDecorator

/**
 * Restricts the target to authenticated users.
 */
export function Authorized(): MethodPropClassDecorator

/**
 * Restricts the target using Bouncer abilities.
 * The user is authorized only if all abilities pass.
 *
 * When used on a field or a field resolver, the parent object is passed
 * to the ability after the user.
 *
 * @example
 *
 * \@Authorized([abilities.editRecipe])
 */
export function Authorized(abilities: readonly BouncerAbility<any>[]): MethodPropClassDecorator

/**
 * Restricts the target using Bouncer abilities.
 * The user is authorized only if all abilities pass.
 *
 * When used on a field or a field resolver, the parent object is passed
 * to the ability after the user.
 *
 * @example
 *
 * \@Authorized(abilities.editRecipe, abilities.isAdmin)
 */
export function Authorized(...abilities: readonly BouncerAbility<any>[]): MethodPropClassDecorator

/**
 * Restricts the target using a Bouncer policy method.
 *
 * When used on a field or a field resolver, the parent object is passed
 * to the policy method after the user.
 *
 * @example
 *
 * \@Authorized(RecipePolicy, 'edit')
 */
export function Authorized<Policy extends Constructor<any>>(
  policy: Policy,
  method: GetPolicyMethods<any, InstanceType<Policy>>
): MethodPropClassDecorator

export function Authorized(...args: any[]): MethodPropClassDecorator {
  if (args.length === 2 && typeof args[0] === 'function' && typeof args[1] === 'string') {
    return BaseAuthorized<AuthorizationRule>([{ policy: args[0], method: args[1] }])
  }

  return BaseAuthorized<AuthorizationRule>(...args)
}
