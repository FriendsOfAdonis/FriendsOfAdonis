/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import User from '#models/user'
import emitter from '@adonisjs/core/services/emitter'
import router from '@adonisjs/core/services/router'
import actions from '@foadonis/actions/services/main'

const CreateUserAction = () => import('#actions/create_user_action')

router.get('/:userId', actions.asController(CreateUserAction))

router.get('/', () => {
  emitter.emit('user:registered', new User())
})
