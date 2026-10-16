import User from '#models/user'
import { BaseFeature } from '@foadonis/flick'

export default class TestFeature extends BaseFeature<User> {
  async resolve(user: User) {
    if (user.id) {
      return 'Hello'
    }

    return false
  }
}
