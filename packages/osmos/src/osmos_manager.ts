import { jsx } from './runtime/jsx.js'
import { ComponentsRegistry } from './components/registry.js'
import { renderToReadableStream, renderToString } from './runtime/render.js'
import { ComponentContext, OsmosConfig } from './types.js'
import { Renderer } from './renderer.js'

type UpdateOptions = {
  id: string
  component: string
  data: Record<string, any>
  actions?: [string, any[]][]
  children: ComponentContext[]
}

export class OsmosManager {
  readonly components: ComponentsRegistry
  readonly config: OsmosConfig

  constructor(config: OsmosConfig) {
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
