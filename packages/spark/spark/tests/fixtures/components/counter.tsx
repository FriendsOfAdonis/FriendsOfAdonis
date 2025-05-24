import { Component } from '../../../src/components/main.js'
import { SparkNode } from '../../../src/jsx/index.js'
import { RefAccessor } from '../../../src/types.js'

export class Counter extends Component<{ id: string; children?: SparkNode }> {
  count = 0

  render(that: RefAccessor<Counter>): SparkNode {
    return (
      <div id={this.$props.id}>
        <button $click={that.increment}>Increment</button>
        <div className="count">Count {this.count}</div>
        {this.$props.children}
      </div>
    )
  }

  increment() {
    this.count++
  }
}
