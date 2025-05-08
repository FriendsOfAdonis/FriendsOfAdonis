import { Component } from '../../components/main.js'
import { Renderable } from '../../contracts/renderable.js'
import type { HTML } from './html.js'

export type ChildType =
  | typeof Component
  | OsmosElement
  | Renderable
  | string
  | number
  | bigint
  | boolean
  | null

type IntrinsicElementsProps<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T]

// TODO: Add BaseComponent and FC
export type ComponentProps<T extends keyof JSX.IntrinsicElements> =
  T extends keyof JSX.IntrinsicElements ? IntrinsicElementsProps<T> : never

export interface FunctionComponent<P = {}> {
  (props: P): OsmosNode
}

type JSXElementConstructor<P> = ((props: P) => OsmosNode) | (new (...args: any[]) => Component<P>)

/**
 * Represents a JSX element.
 */
export type OsmosElement<
  P = {},
  T extends string | JSXElementConstructor<P> | symbol =
    | string
    | JSXElementConstructor<any>
    | symbol,
> = {
  $$typeof: symbol
  type: T
  props: P
}

export type AwaitedOsmosNode =
  | OsmosElement
  | string
  | number
  | bigint
  | Iterable<OsmosNode>
  | boolean
  | null
  | undefined

/**
 * Represents all of the things Osmos can render.
 *
 * Where {@link OsmosElement} only represents JSX, `OsmosNode` represents all of the things Osmos can render.
 */
export type OsmosNode =
  | OsmosElement
  | string
  | number
  | bigint
  | Iterable<OsmosNode>
  | boolean
  | null
  | undefined
  | Promise<AwaitedOsmosNode>
  /**
   * Used to render already hydrated and mounted components.
   *
   * @internal
   */
  | Component<any>

export type FC<P = {}> = FunctionComponent<P>

declare global {
  namespace JSX {
    type ElementType<P = any> = string | JSXElementConstructor<any>

    interface Element extends OsmosElement<any, any> {}

    interface ElementClass extends Component<any> {
      render(): any
    }

    interface ElementAttributesProperty {
      $props: {}
    }

    interface ElementChildrenAttribute {
      children: {}
    }

    interface IntrinsicAttributes {}
    interface IntrinsicElements extends HTML.Elements, HTML.SVGElements {}
  }
}
