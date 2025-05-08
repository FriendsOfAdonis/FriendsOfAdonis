import { Head, Link } from '@foadonis/osmos'
import { CounterComponent } from '../osmos/components/counter.js'
import CreatePostForm from '#osmos/components/create_post_form'

export default class TestController {
  async index() {
    return (
      <div>
        <button x-test>Test</button>
        <h1>Home page</h1>
        <div>
          <Head>
            <title>Home</title>
          </Head>
        </div>
        <Link href="/">Home</Link>
        <Link href="/test">Test</Link>
        <Test />
        <CreatePostForm />
      </div>
    )
  }

  async test() {
    return (
      <div>
        <h1>Test page</h1>
        <Link href="/">Home</Link>
        <Link href="/test">Test</Link>
        <Test />
        <Head>
          <title>Test</title>
        </Head>
      </div>
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
