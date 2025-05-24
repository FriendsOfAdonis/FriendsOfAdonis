type Action = { method: string; params: any[] }
type Updates = Record<string, any>

export class HTMLSparkComponentElement extends HTMLElement {
  fragments: HTMLSparkComponentElement[] = []

  $loaded = false

  #actions: Action[] = []
  #updates: Updates = {}

  get componentId() {
    const id = this.getAttribute('spark:id')
    if (!id) throw new Error('The fragment does not have spark:id')
    return id
  }

  get parentComponent() {
    return HTMLSparkComponentElement.findNearestComponent(this)
  }

  get lazy() {
    return this.hasAttribute('spark:lazy')
  }

  async connectedCallback() {
    this.#bootParent()

    if (this.lazy) {
      await this.commit()
    }

    this.$loaded = true
  }

  #bootParent() {
    const parent = HTMLSparkComponentElement.findNearestComponent(this)
    if (!parent) return
    parent.fragments.push(this)
  }

  async update(property: string, value: any) {
    this.#updates[property] = value
  }

  async action(name: string, params: any[] = []) {
    this.#actions.push({
      method: name,
      params,
    })

    await this.commit()
  }

  async commit() {
    Spark.send([
      {
        componentId: this.componentId,
        events: [
          ...this.#actions.map((a) => ({
            name: 'action' as const,
            payload: {
              method: a.method,
            },
          })),
          ...(Object.keys(this.#updates).length > 0
            ? [
                {
                  name: 'updates' as const,
                  payload: {
                    data: this.#updates,
                  },
                },
              ]
            : []),
        ],
      },
    ])

    this.#actions = []
    this.#updates = {}
  }

  static findNearestComponent(el: HTMLElement): HTMLSparkComponentElement | undefined {
    let current = el.parentElement
    while (current) {
      if (current instanceof HTMLSparkComponentElement) {
        return current
      }

      current = current.parentElement
    }
  }
}
