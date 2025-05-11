import { ComponentProps, FC, SparkElement, SparkNode } from '../../src/jsx/types/jsx.js'
import { test } from '@japa/runner'
import { HTML } from '../../src/jsx/types/html.js'
import { Component } from '../../src/components/main.js'

test('JSX.Element', ({ expectTypeOf }) => {
  expectTypeOf(<div>Hello</div>).toEqualTypeOf<JSX.Element>()
  expectTypeOf<JSX.Element>().toEqualTypeOf<SparkElement<any, any>>()
})

test.group('ComponentProps', () => {
  test('HTMLElement', ({ expectTypeOf }) => {
    expectTypeOf<ComponentProps<'button'>>().toEqualTypeOf<
      HTML.ButtonAttributes<HTMLButtonElement>
    >()

    expectTypeOf<ComponentProps<'div'>>().toEqualTypeOf<HTML.GlobalAttributes<HTMLDivElement>>()
  })

  test('Function component', ({ expectTypeOf }) => {
    expectTypeOf<ComponentProps<FC<{}>>>().toEqualTypeOf<{}>()
    expectTypeOf<ComponentProps<FC<{ hello: 'world' }>>>().toEqualTypeOf<{ hello: 'world' }>()
    expectTypeOf<ComponentProps<FC<{ children: SparkNode }>>>().toEqualTypeOf<{
      children: SparkNode
    }>()
  })

  test('Class component', ({ expectTypeOf }) => {
    class Test extends Component<{ hello: 'world' }> {
      render(): SparkNode {
        throw new Error('Method not implemented.')
      }
    }

    expectTypeOf<ComponentProps<typeof Test>>().toEqualTypeOf<{ hello: 'world' }>()
  })
})
