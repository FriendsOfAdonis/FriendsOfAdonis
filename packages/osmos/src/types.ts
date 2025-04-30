import { ComponentsRegistry } from './component/registry.js'

export interface OsmosConfig {}

export type ComponentContext = {
  id: string
  component: string
  data: Record<string, any>
  children: ComponentContext[]
}

export type RenderContext = {
  registry: ComponentsRegistry
  children: ComponentContext[]
}
