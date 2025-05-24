import { test } from '@japa/runner'

test.group('component', () => {
  // test('$click', async ({ visit }) => {
  //   class Counter extends Component {
  //     count = 0
  //
  //     render(that: RefAccessor<Counter>): SparkNode {
  //       return (
  //         <div>
  //           <button $click={that.increment}>Increment</button>
  //           <div id="count">Count {this.count}</div>
  //         </div>
  //       )
  //     }
  //
  //     increment() {
  //       this.count++
  //     }
  //   }
  //
  //   await setupHttpServer((router) => {
  //     router.get('/', () => <Counter />)
  //   })
  //
  //   const page = await visit('/')
  //
  //   await page.assertExists('spark-component')
  //
  //   await page.assertTextContains('button', 'Increment')
  //   await page.assertTextContains('#count', 'Count 0')
  //   await page.click('button')
  //
  //   await page.assertTextContains('#count', 'Count 1')
  //   await page.click('button')
  //   await page.click('button')
  //   await page.assertTextContains('#count', 'Count 3')
  // })
  //
  // test('nested components', async ({ visit }) => {
  //   await setupHttpServer((router) => {
  //     router.get('/', () => (
  //       <Counter id="parent">
  //         <Counter id="children" />
  //       </Counter>
  //     ))
  //   })
  //
  //   const page = await visit('/')
  //
  //   await page.assertTextContains('#parent > .count', 'Count 0')
  //   await page.assertTextContains('#children > .count', 'Count 0')
  //
  //   await page.click('#parent > button')
  //   await page.assertTextContains('#parent > .count', 'Count 1')
  //   await page.assertTextContains('#children > .count', 'Count 1')
  // })
})
