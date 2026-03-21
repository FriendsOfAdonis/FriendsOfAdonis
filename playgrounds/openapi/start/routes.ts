import { actions } from '#generated/actions'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'
import openapi from '@foadonis/openapi/services/main'

const PostsController = () => import('#controllers/posts_controller')

router
  .group(() => {
    router.post('/users', actions.Recipes.CreateRecipe.asController()).as('test')
    router.resource('posts', PostsController)

    router.get('/recipes', actions.Recipes.CreateRecipe.asController()).as('create_recipe')
  })
  .as('api.v1')
  .prefix('/api/v1')

router
  .group(() => {
    router.post('/users', actions.Recipes.CreateRecipe.asController()).as('create_recipe')
  })
  .as('api.v2')
  .prefix('/api/v2')

openapi.registerController('/api/v1', controllers.OpenapiV1).as('openapi.v1')
openapi.registerController('/api/v2', controllers.OpenapiV2).as('openapi.v2')
