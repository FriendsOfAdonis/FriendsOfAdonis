/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')
const TestController = () => import('#controllers/test_controller')

router.get('/', [TestController, 'index'])
router.get('/test', [TestController, 'test'])

router
  .group(() => {
    router.get('/signin', [AuthController, 'signin']).as('signin')
    router.get('/signup', [AuthController, 'signup']).as('signup')
  })
  .as('auth')
