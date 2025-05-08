import { FC, jsx, OsmosElement, OsmosNode } from '@foadonis/osmos/jsx-runtime'
import { renderToReadableStream, renderToString } from './runtime/render.js'
import { ComponentsRegistry } from './components/registry.js'

export class Renderer {
  #registry: ComponentsRegistry
  #layout?: FC<{ children: OsmosNode }>

  constructor(registry: ComponentsRegistry) {
    this.#registry = registry
  }

  layout(layout: FC<{ children: OsmosNode }>) {
    this.#layout = layout
    return this
  }

  render(component: OsmosElement) {
    const root = this.#layout ? jsx(this.#layout, { children: component }) : component

    return {
      toReadableStream: () => {
        return renderToReadableStream(root, {
          registry: this.#registry,
        })
      },
      toString: () => {
        return renderToString(root, { registry: this.#registry })
      },
    }
  }
}
