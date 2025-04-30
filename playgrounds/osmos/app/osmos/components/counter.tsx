import { BaseComponent } from '@foadonis/osmos'
import { Button } from '../../../osmos/components/button.js'

export class CounterComponent extends BaseComponent {
  count = 0

  async render() {
    return (
      <form>
        <Button>Test</Button>
      </form>
    )
  }

  save() {
    this.count++
  }
}
