import { renderToReadableStream, renderToString } from './jsx/render/main.js'
import { jsx } from './jsx/runtime/jsx.js'
import { FC, SparkElement, SparkNode } from './jsx/types/jsx.js'
import { ComponentsManager } from './components/manager.js'

export class Renderer {
  #manager: ComponentsManager
  #layout?: FC<{ children: SparkNode }>

  constructor(manager: ComponentsManager) {
    this.#manager = manager
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
          manager: this.#manager,
        })
      },
      toString: () => {
        return renderToString(root, { manager: this.#manager })
      },
    }
  }
}
