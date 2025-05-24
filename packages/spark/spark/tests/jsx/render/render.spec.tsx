import { test } from '@japa/runner'
import { AssertionError } from 'node:assert'
import { renderToString } from '../../../src/jsx/render/main.js'
import { Component } from '../../../src/components/main.js'
import { SparkFactory } from '../../../factories/spark_factory.js'

async function assertRender(element: Parameters<typeof renderToString>[0], expected: string) {
  const spark = await new SparkFactory().create()
  const result = await renderToString(element, spark.createInstance())

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
    await assertRender(<div className="hello"></div>, '<div class="hello"></div>')
  })

  test('Nested', async () => {
    await assertRender(
      <div>
        <h1>Hello</h1>World
      </div>,
      '<div><h1>Hello</h1>World</div>'
    )
  })

  test('FC', async () => {
    let TestComponent: any = () => <div>Test</div>
    await assertRender(<TestComponent />, '<div>Test</div>')

    TestComponent = ({ children }: any) => <div>{children}</div>
    await assertRender(<TestComponent>Hello</TestComponent>, '<div>Hello</div>')

    TestComponent = ({ children, ...props }: any) => <div {...props}>{children}</div>
    await assertRender(<TestComponent className="test" />, '<div class="test"></div>')
  })

  test('FC async', async () => {
    let TestComponent: any = async () => <div>Test</div>
    await assertRender(<TestComponent />, '<div>Test</div>')
  })

  test('BaseComponent', async () => {
    class TestComponent<P = {}> extends Component<P> {
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
      '<spark-component x-data="{}" spark:id="instance_id" spark:component="component_id"><div>Hello</div></spark-component>'
    )

    class TestComponentWithProps extends TestComponent<{ title: string }> {
      render() {
        return <div>{this.$props.title}</div>
      }
    }

    await assertRender(
      <TestComponentWithProps title="Test" />,
      '<spark-component x-data="{}" spark:id="instance_id" spark:component="component_id"><div>Test</div></spark-component>'
    )
  })
})
