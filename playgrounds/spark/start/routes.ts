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
const WelcomeController = () => import('#controllers/welcome_controller')

router.get('/', [WelcomeController, 'index'])

router
  .group(() => {
    router.get('/signin', [AuthController, 'signin']).as('signin')
    router.get('/signup', [AuthController, 'signup']).as('signup')
  })
  .as('auth')
