import User from '#models/user'
import Recipe from '#models/recipe'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class RecipePolicy extends BasePolicy {
  /**
   * Delete the following method to start from
   * scratch
   */
  delete(_user: User, _recipe?: Recipe): AuthorizerResponse {
    return true
  }
}
