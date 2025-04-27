import emitter from '@adonisjs/core/services/emitter'
import actions from '@foadonis/actions/services/main'

const CreateUserAction = () => import('#actions/create_user_action')

emitter.on('user:registered', actions.asListener(CreateUserAction))
