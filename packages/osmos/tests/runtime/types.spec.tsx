import { OsmosElement } from '@foadonis/osmos/jsx-runtime'
import { test } from '@japa/runner'

test('hello', ({ expectTypeOf }) => {
  expectTypeOf(<div>Hello</div>).toEqualTypeOf<JSX.Element>()

  expectTypeOf<JSX.Element>().toEqualTypeOf<OsmosElement<any, any>>()
})
