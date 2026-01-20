import type Recipe from '#models/recipe'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class RecipeTranformer extends BaseTransformer<Recipe> {
  toObject() {
    return this.pick(this.resource, ['id', 'title'])
  }
}
