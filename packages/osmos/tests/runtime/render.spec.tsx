import { test } from '@japa/runner'
import { renderToString } from '../../src/runtime/render.js'
import { ComponentsRegistry } from '../../src/component/registry.js'
import { AssertionError } from 'node:assert'
import { BaseComponent } from '../../src/component/main.js'

const registry = new ComponentsRegistry()

async function assertRender(element: Parameters<typeof renderToString>[0], expected: string) {
  const result = await renderToString(element, {
    registry,
  })

  if (result !== expected) {
    throw new AssertionError({
      message: ['Cannot assert render', `Expected:`, expected, `\nBut found:`, result].join('\n'),
    })
  }
}

test.group('renderToString', () => {
  test('primitives', async () => {
    await assertRender('Hello', 'Hello')

    await assertRender(true, '')
    await assertRender(false, '')

    await assertRender(0, '0')
    await assertRender(8_000, '8000')
    await assertRender(0.8, '0.8')
    await assertRender(BigInt(8000000), '8000000')

    await assertRender(null, '')
    await assertRender(undefined, '')
  })

  test('HTMLElement', async () => {
    await assertRender(<div>Hello you</div>, '<div>Hello you</div>')
    await assertRender(<p />, '<p></p>')
    await assertRender(<br />, '<br />')
    await assertRender(<div class="hello"></div>, '<div class="hello"></div>')
  })

  test('FC', async () => {
    let TestComponent: any = () => <div>Test</div>
    await assertRender(<TestComponent />, '<div>Test</div>')

    TestComponent = ({ children }: any) => <div>{children}</div>
    await assertRender(<TestComponent>Hello</TestComponent>, '<div>Hello</div>')

    TestComponent = ({ children, ...props }: any) => <div {...props}>{children}</div>
    await assertRender(<TestComponent class="test" />, '<div class="test"></div>')
  })

  test('FC async', async () => {
    let TestComponent: any = async () => <div>Test</div>
    await assertRender(<TestComponent />, '<div>Test</div>')
  })

  test('BaseComponent', async () => {
    class TestComponent<P = {}> extends BaseComponent<P> {
      $id = 'instance_id'
      static get $id(): string {
        return 'component_id'
      }

      render() {
        return <div>Hello</div>
      }
    }

    await assertRender(
      <TestComponent />,
      '<osmos-component osmos:data="{}" osmos:id="instance_id" osmos:component="component_id"><div>Hello</div></osmos-component>'
    )

    class TestComponentWithProps extends TestComponent<{ title: string }> {
      render() {
        return <div>{this.props.title}</div>
      }
    }

    await assertRender(
      <TestComponentWithProps title="Test" />,
      '<osmos-component osmos:data="{}" osmos:id="instance_id" osmos:component="component_id"><div>Test</div></osmos-component>'
    )
  })
})
