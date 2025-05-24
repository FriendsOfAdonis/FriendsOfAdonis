import * as assert from 'node:assert'
import { Component } from '../components/main.js'
import { ComponentActions } from '../types.js'

export class TestableComponent<C extends Component<any>> {
  component: C

  constructor(component: C) {
    this.component = component
  }

  async call(action: ComponentActions<C>) {
    await this.component.$call(action)
  }

  /**
   * Updates the component's props
   *
   * @example
   * component.setProps({ label: 'Hello' })
   */
  setProps(props: C['$props']) {
    Reflect.set(this.component, '$props', props)
    return this
  }

  /**
   * Asserts that props are deeeply strict equal.
   *
   * @example
   * component.assertProps({ label: 'Hello' })
   */
  assertProps(expected: C['$props']) {
    assert.deepStrictEqual(this.component.$props, expected)
    return this
  }
}
