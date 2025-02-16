/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import User from '#models/user'
import router from '@adonisjs/core/services/router'
import notifier from '@foadonis/notifier/services/main'
import WelcomeNotification from '../app/notifications/welcome.js'

router.get('/', async ({ view, auth }) => {
  let user = auth.user

  if (!user) {
    user = await User.firstOrCreate(
      {
        email: 'contact@friendsofadonis.com',
      },
      { password: 'goodpass' }
    )

    const guard = auth.use('web')
    await guard.login(user)
  }

  await notifier.notify(user, new WelcomeNotification(), ['firebasePush'])

  return view.render('pages/home')
})
