import type User from '#models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'
import RecipeTranformer from './recipe_transformer.ts'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    return this.pick(this.resource, ['id', 'email'])
  }

  toDetailed() {
    return {
      ...this.pick(this.resource, ['id', 'fullName', 'password']),
      recipes: RecipeTranformer.transform(this.resource.recipes),
    }
  }
}
