import { Component } from '@foadonis/osmos'
import { Button } from './ui/button.js'
import { RefAccessor } from '@foadonis/osmos/types'
import { html } from '@foadonis/osmos/jsx-runtime'

export class CounterComponent extends Component {
  count = 0

  async render(that: RefAccessor<CounterComponent>) {
    return (
      <div>
        <Button $click={that.increment}>Count {this.count}</Button>
        <div>{html`<h1>Hello world ${this.count}</h1>`}</div>
      </div>
    )
  }

  increment() {
    this.count++
  }
}
