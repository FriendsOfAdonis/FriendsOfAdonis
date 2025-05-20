import router from '@adonisjs/core/services/router'
import openapi from '@foadonis/openapi/services/main'

const DemoController = () => import('#controllers/demo_controller')
const PostsController = () => import('#controllers/posts_controller')

router.get('/users', [DemoController, 'index'])
router.get('/users/:id', [DemoController, 'show'])
router.resource('posts', PostsController)

openapi.registerRoutes()
