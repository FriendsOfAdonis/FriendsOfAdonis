import { FC, SparkNode } from './jsx/types/jsx.js'
import { ComponentsRegistry } from './components/registry.js'
import { Ref } from './ref.js'
import { HttpContext } from '@adonisjs/core/http'
import { Component } from './components/main.js'

export type LazyImport<T> = () => Promise<T>

export interface SparkConfig {
  layout: (ctx: HttpContext) => LazyImport<{ default: FC<{ children: SparkNode }> }>
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

export type ComponentActions<T extends Component<any>> = {
  [key in keyof T]: T[key] extends (...args: any[]) => any ? key : never
}[keyof T]

export interface Resolver {
  resolve<T>(constructor: new (...args: any[]) => T): Promise<T>
}

export type ComponentSnapshot = {
  data: Record<string, any>
  props: Record<string, any>
  memo: {
    name: string
    id: string
  }
}

export type ComponentUpdates = Record<string, any>

export type ComponentCall = { method: string; params?: any[] }

// Messages
export type SparkMessage = {
  componentId: string
  events: (SparkActionMessage | SparkUpdatesMessage)[]
}

export type SparkActionMessage = {
  name: 'action'
  payload: {
    method: string
  }
}

export type SparkUpdatesMessage = {
  name: 'updates'
  payload: {
    data: Record<string, any>
  }
}

declare module '@foadonis/powercord/types' {
  export interface PowercordMessages {
    'spark:morph': { componentId: string; html: string }
  }
}
