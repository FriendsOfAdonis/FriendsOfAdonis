import { Component } from '@foadonis/spark'
import { Button } from './ui/button.js'
import { RefAccessor } from '@foadonis/spark/types'
import { html } from '@foadonis/spark/jsx'

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
