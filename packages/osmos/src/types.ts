import { FC, OsmosNode } from './runtime/types/jsx.js'
import { ComponentsRegistry } from './components/registry.js'
import { Ref } from './ref.js'

export type LazyImport<T> = () => Promise<T>

export interface OsmosConfig {
  layout: LazyImport<{ default: FC<{ children: OsmosNode }> }>
}

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

export type ReferencableProperties<T> = {
  [key in keyof T]: IsReferencable<T>
}

export type IsReferencable<T> = T extends number | string | boolean | undefined | null | Function
  ? true
  : false

type ObjectPropertyAccessor<T> = {
  [K in keyof T]-?: RefAccessor<T[K]>
}

export type RefAccessor<T = unknown> =
  IsReferencable<T> extends true ? Ref<T> : ObjectPropertyAccessor<T>
