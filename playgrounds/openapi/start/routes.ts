import { actions } from '#generated/actions'
import girouette from '@adonisjs-community/girouette/services/main'
import router from '@adonisjs/core/services/router'
import { toGirouetteControllers } from '@foadonis/actions/girouette'
import openapi from '@foadonis/openapi/services/main'

const PostsController = () => import('#controllers/posts_controller')

router.post('/users', actions.Recipes.CreateRecipe.asController())
router.resource('posts', PostsController)

router.get('/recipes', actions.Recipes.CreateRecipe.asController())

girouette.controllers(toGirouetteControllers(actions))

openapi.registerRoutes()
