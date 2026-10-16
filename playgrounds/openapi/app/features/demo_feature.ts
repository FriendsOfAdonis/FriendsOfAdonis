import User from '#models/user'
import { BaseFeature } from '@foadonis/flick'

export default class DemoFeature extends BaseFeature<User> {
  async before(user: User) {}

  async resolve(user: User) {
    console.log('FEATURE IS ACTIVE')

    if (user.id) {
      return 'Hello'
    }

    return 5
  }
}
