import { actions } from '#generated/actions'
import girouette from '@adonisjs-community/girouette/services/main'
import User from '#models/user'
import router from '@adonisjs/core/services/router'
import flick from '@foadonis/flick/services/main'
import openapi from '@foadonis/openapi/services/main'

import { toGirouetteControllers } from '@foadonis/actions/girouette'

const PostsController = () => import('#controllers/posts_controller')

router.post('/users', actions.Recipes.CreateRecipe.asController())
router.resource('posts', PostsController)

router.get('/recipes', actions.Recipes.CreateRecipe.asController())

girouette.controllers(toGirouetteControllers(actions))

router.get('/test', async () => {
  const user = new User()

  const value = await flick.for(user).value('demo')
  const [test, hello] = await flick.for(user).values(['demo', 'test'])

  return value
})

openapi.registerRoutes()
