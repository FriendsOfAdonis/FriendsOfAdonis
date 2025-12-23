import router from '@adonisjs/core/services/router'
import openapi from '@foadonis/openapi/services/main'
import flow from '@foadonis/flow/services/main'
import TestWorkflow from '../app/workflows/test_workflow.js'

const DemoController = () => import('#controllers/demo_controller')
const PostsController = () => import('#controllers/posts_controller')

router.get('/users', [DemoController, 'index'])
router.resource('posts', PostsController)

router.get('/', async () => {
  await flow.run(TestWorkflow, {
    greet: 'hello',
  })
})

openapi.registerRoutes()
