import UserRegistered from '#events/user_registered'
import { actions } from '#generated/actions'
import emitter from '@adonisjs/core/services/emitter'

emitter.on(UserRegistered, actions.Users.SendRegistrationEmail.asListener())
