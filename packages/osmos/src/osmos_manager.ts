import { ComponentsRegistry } from './component/registry.js'
import { renderToString } from './runtime/render.js'
import { ComponentContext } from './types.js'

type MountOptions = {
  id: string
  component: string
  data: Record<string, any>
  actions?: [string, any[]][]
  children: ComponentContext[]
}

export class OsmosManager {
  readonly components: ComponentsRegistry

  constructor() {
    this.components = new ComponentsRegistry()
  }

  async mount({ id, component: componentId, data, actions, children }: MountOptions) {
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
}
