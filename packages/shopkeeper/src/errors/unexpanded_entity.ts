import { Exception } from '@adonisjs/core/exceptions'

export class UnexpandedEntity extends Exception {
  static code = 'E_UNEXPANDED_ENTITY'

  static notExpanded(entity: string, options?: ErrorOptions) {
    return new UnexpandedEntity(
      `'${entity}' was not expanded. Make sure to expand the necessary fields when retrieving the entity from Stripe.`,
      options
    )
  }
}
