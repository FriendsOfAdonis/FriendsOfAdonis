import { Query, Resolver } from '@foadonis/graphql'

@Resolver()
export default class TestResolver {
  @Query(() => Boolean)
  test() {
    return false
  }
}
