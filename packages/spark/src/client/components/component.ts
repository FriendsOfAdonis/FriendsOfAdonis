import Alpine from 'alpinejs'
import { setPropertyFromAccessor } from '../../utils/properties.js'

type Action = [string, any[]]

type ComponentJSON = {
  id: string
  component: string
  data: unknown
  children: ComponentJSON[]
}

export class HTMLComponentElement extends HTMLElement {
  fragments: HTMLComponentElement[] = []

  $loaded = false

  #actions: Action[] = []
  #data: Record<string, any> = {}

  get componentId() {
    const id = this.getAttribute('spark:id')
    if (!id) throw new Error('The fragment does not have spark:id')
    return id
  }

  get component() {
    const component = this.getAttribute('spark:component')
    if (!component) throw new Error('The fragment does not have spark:component')
    return component
  }

  get parentComponent() {
    return HTMLComponentElement.findNearestComponent(this)
  }

  get lazy() {
    return this.hasAttribute('spark:lazy')
  }

  get data() {
    return Alpine.$data(this)
  }

  async connectedCallback() {
    this.#bootParent()
    this.#refreshData()

    if (this.lazy) {
      await this.refresh()
    }

    this.$loaded = true
  }

  #bootParent() {
    const parent = HTMLComponentElement.findNearestComponent(this)
    if (!parent) return
    parent.fragments.push(this)
  }

  /**
   * Refresh data from element attribute
   */
  #refreshData() {
    const data = this.getAttribute('spark:data')
    if (!data) return {}
    this.#data = Alpine.evaluate(this, data)
  }

  async update() {}

  async action(name: string, args: any[] = []) {
    this.#actions.push([name, args])
    await this.refresh()
  }

  async refresh() {
    const res = await Spark.http.post('/_spark/update', {
      component: {
        ...this.toJSON(),
        actions: this.#actions,
      },
    })

    this.#actions = []

    const html = await res.text()

    Alpine.morph(this, html, {})

    this.#refreshData()
  }

  async model(name: string, event: KeyboardEvent) {
    if (!event.target) throw new Error('Event passed to $wire.model does not have an element')
    if (!('value' in event.target)) throw new Error('Event target does not have a value key')

    setPropertyFromAccessor(name, event.target.value, this.#data)

    await this.refresh()
  }

  toJSON(): ComponentJSON {
    return {
      id: this.componentId,
      component: this.component,
      data: this.data,
      children: this.fragments.map((fragment) => fragment.toJSON()),
    }
  }

  static findNearestComponent(el: HTMLElement): HTMLComponentElement | undefined {
    let current = el.parentElement
    while (current) {
      if (current instanceof HTMLComponentElement) {
        return current
      }

      current = current.parentElement
    }
  }
}
