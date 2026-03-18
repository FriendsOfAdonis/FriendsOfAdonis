import { loader } from '@foadonis/actions'

export const actions = {
  Demo: {
    GreetJob: loader(() => import('#actions/demo/greet_job_action')),
    RunJob: loader(() => import('#actions/demo/run_job_action')),
  },
  Recipes: {
    CreateRecipe: loader(() => import('#actions/recipes/create_recipe_action')),
  },
}
