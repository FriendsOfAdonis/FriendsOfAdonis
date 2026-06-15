import { loader } from '@foadonis/actions'

export const actions = {
  Recipes: {
    CreateRecipe: loader(() => import('#actions/recipes/create_recipe_action')),
  },
}
