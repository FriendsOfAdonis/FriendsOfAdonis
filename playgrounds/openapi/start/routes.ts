import { actions } from '#generated/actions'
import router from '@adonisjs/core/services/router'
import openapi from '@foadonis/openapi/services/main'

const DemoController = () => import('#controllers/demo_controller')
const PostsController = () => import('#controllers/posts_controller')

router.get('/users', actions.Recipes.CreateRecipe.asController())
router.resource('posts', PostsController)

router.get('/recipes', actions.Recipes.CreateRecipe.asController())

openapi.registerRoutes()
