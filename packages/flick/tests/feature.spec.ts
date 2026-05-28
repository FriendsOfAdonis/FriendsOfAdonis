import { test } from '@japa/runner'
import { BaseFeature } from '../src/base_feature.ts'
import flick from '../services/main.ts'

class User {}

class NewApiFeature extends BaseFeature<User> {
  async before(user: User) {}

  async resolve(user: User) {
    return false
  }
}

test('should work', () => {})
