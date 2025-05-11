import { jsx } from './jsx/runtime/jsx.js'
import { ComponentsRegistry } from './components/registry.js'
import { renderToReadableStream, renderToString } from './jsx/render/main.js'
import { ComponentContext, SparkConfig } from './types.js'
import { Renderer } from './renderer.js'

type UpdateOptions = {
  id: string
  component: string
  data: Record<string, any>
  actions?: [string, any[]][]
  children: ComponentContext[]
}

export class SparkManager {
  readonly components: ComponentsRegistry
  readonly config: SparkConfig

  constructor(config: SparkConfig) {
    this.components = new ComponentsRegistry()
    this.config = config
  }

  async updateComponent({ id, component: componentId, data, actions, children }: UpdateOptions) {
    const componentClass = this.components.get(componentId)
    if (!componentClass) throw new Error(`component ${componentId} not found`) // TODO: error

    const component = new componentClass()

    component.$id = id
    component.$hydrate(data, children)

    for (const [action, args] of actions ?? []) {
      await component.$call(action, args)
    }

    return renderToString(component, { registry: this.components })
  }

  render(node: any) {
    return renderToString(node, { registry: this.components })
  }

  async renderWithLayout(node: any) {
    const Layout = await this.config.layout().then((r) => r.default)
    const layout = jsx(Layout, { children: node })

    return renderToReadableStream(layout, {
      registry: this.components,
    })
  }

  /**
   * Creates a new renderer.
   */
  createRenderer() {
    return new Renderer(this.components)
  }
}
