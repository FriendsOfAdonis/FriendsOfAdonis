import { test } from '@japa/runner'
import { BaseFeature } from '../src/base_feature.ts'
import {
  InferFeatureResult,
  InferFeatureScope,
  InferFeaturesResult,
  InferFeaturesScope,
} from '../src/types.ts'

type User = { firstName: string; lastName: string }
type Post = { title: string }

class UserFeature extends BaseFeature<User> {
  async resolve() {
    return true
  }
}

class OtherUserFeature extends BaseFeature<User> {
  async resolve() {
    return 5
  }
}

class PostFeature extends BaseFeature<Post> {
  async resolve() {
    return true
  }
}

test('should extract feature scope', ({ expectTypeOf }) => {
  expectTypeOf<InferFeatureScope<typeof UserFeature>>().toEqualTypeOf<User>()
  expectTypeOf<InferFeatureScope<typeof PostFeature>>().toEqualTypeOf<Post>()
})

test('should extract features scope', ({ expectTypeOf }) => {
  expectTypeOf<
    InferFeaturesScope<{ user: typeof UserFeature; other: typeof OtherUserFeature }>
  >().toEqualTypeOf<User>()

  // TODO: Should be `User & Post`
  expectTypeOf<
    InferFeaturesScope<{ user: typeof UserFeature; post: typeof PostFeature }>
  >().toEqualTypeOf<User | Post>()
})

test('should extract feature value', ({ expectTypeOf }) => {
  expectTypeOf<InferFeatureResult<typeof UserFeature>>().toEqualTypeOf<boolean>()
  expectTypeOf<InferFeatureResult<typeof OtherUserFeature>>().toEqualTypeOf<number>()
})

test('should extract features values', ({ expectTypeOf }) => {
  expectTypeOf<
    InferFeaturesResult<{ user: typeof UserFeature; other: typeof OtherUserFeature }>
  >().toEqualTypeOf<{ user: boolean; other: number }>()
})
