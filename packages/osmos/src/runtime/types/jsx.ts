// deno-lint-ignore-file no-explicit-any

import { InteractiveRefactorArguments } from 'typescript'
import { BaseComponent } from '../../component/main.js'
import { Renderable } from '../../contracts/renderable.js'
import type { HTML } from './html.js'

export type ChildType =
  | typeof BaseComponent
  | VNode
  | Renderable
  | string
  | number
  | bigint
  | boolean
  | null

// export type VNode = readonly [
//   tag: string | symbol | FC<any>,
//   props: Record<string, any>,
//   $vnode: symbol,
// ]

type IntrinsicElementsProps<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T]

export type ComponentProps<T extends keyof JSX.IntrinsicElements> =
  T extends keyof JSX.IntrinsicElements ? IntrinsicElementsProps<T> : never

export type VNode = {
  $$typeof: Symbol
  type: string | typeof BaseComponent | FC<any>
  props: Record<string, any>
}

export interface FC<P = {}> {
  (props: P): ChildType | Promise<ChildType> | Generator<ChildType> | AsyncGenerator<ChildType>
  displayName?: string
  rendering?: string
}

export interface TC {
  (strings: TemplateStringsArray, ...values: unknown[]): VNode
}

declare global {
  namespace JSX {
    type ElementType<P = any> =
      | {
          [K in keyof IntrinsicElements]: P extends IntrinsicElements[K] ? K : never
        }[keyof IntrinsicElements]
      | FC<P>
      | typeof BaseComponent<P>
    interface Element extends VNode {}
    interface ElementClass {
      render: any
    }

    interface ElementAttributesProperty {
      props: any
    }

    interface IntrinsicAttributes {}
    interface IntrinsicElements extends HTML.Elements, HTML.SVGElements {}
  }
  // eslint-disable-next-line one-var
  var html: TC, css: TC, js: TC
}
