import { Link } from '@foadonis/osmos'
import { CounterComponent } from '../osmos/components/counter.js'
import vite from '@adonisjs/vite/services/main'

export default class TestController {
  async index() {
    const tags = await vite.generateEntryPointsTags([
      'resources/js/app.js',
      'resources/css/app.css',
    ])

    return (
      <html>
        <head>
          <script type="module" src="/@vite/client"></script>
          {tags.map((tag) => tag.toString())}
        </head>
        <body x-data>
          <div>
            <button x-test>Test</button>
            <h1>Home page</h1>
            <Link href="/">Home</Link>
            <Link href="/test">Test</Link>
            <Test />
          </div>
        </body>
      </html>
    )
  }

  async test() {
    return (
      <html>
        <head></head>
        <body x-data>
          <div>
            <h1>Test page</h1>
            <Link href="/">Home</Link>
            <Link href="/test">Test</Link>
            <Test />
          </div>
        </body>
      </html>
    )
  }
}

const Test = () => {
  return (
    <h1>
      <HelloWorld />
      <CounterComponent />
      <h1 x-data="{ message: 'I ❤️ Alpine' }" x-text="message"></h1>
    </h1>
  )
}

function HelloWorld() {
  return (
    <div x-data="{ count: 0 }">
      <button x-on:click="count++">Increment</button>
      <span x-text="count"></span>
    </div>
  )
}
