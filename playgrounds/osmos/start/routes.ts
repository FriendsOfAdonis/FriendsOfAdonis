/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const TestController = () => import('#controllers/test_controller')

router.get('/', [TestController, 'index'])
router.get('/test', [TestController, 'test'])
