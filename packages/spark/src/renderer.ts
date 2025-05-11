import { renderToReadableStream, renderToString } from './jsx/render/main.js'
import { jsx } from './jsx/runtime/jsx.js'
import { ComponentsRegistry } from './components/registry.js'
import { FC, SparkElement, SparkNode } from './jsx/types/jsx.js'

export class Renderer {
  #registry: ComponentsRegistry
  #layout?: FC<{ children: SparkNode }>

  constructor(registry: ComponentsRegistry) {
    this.#registry = registry
  }

  layout(layout: FC<{ children: SparkNode }>) {
    this.#layout = layout
    return this
  }

  render(component: SparkElement) {
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
