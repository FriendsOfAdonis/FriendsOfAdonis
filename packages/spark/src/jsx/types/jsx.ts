import { Component } from '../../components/main.js'
import { Renderable } from '../../contracts/renderable.js'
import type { HTML } from './html.js'

export type ChildType =
  | typeof Component
  | SparkElement
  | Renderable
  | string
  | number
  | bigint
  | boolean
  | null

type IntrinsicElementsProps<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T]

type FunctionComponentProps<T extends FC<any>> = T extends FC<infer Props> ? Props : never
type ClassComponentProps<T extends ClassComponent<any>> =
  T extends ClassComponent<infer Props> ? Props : never

type ClassComponent<P = {}> = new (...args: any[]) => Component<P>

// TODO: Add BaseComponent and FC
export type ComponentProps<
  T extends keyof JSX.IntrinsicElements | FunctionComponent<any> | ClassComponent<any>,
> = T extends keyof JSX.IntrinsicElements
  ? IntrinsicElementsProps<T>
  : T extends FunctionComponent<any>
    ? FunctionComponentProps<T>
    : T extends ClassComponent<any>
      ? ClassComponentProps<T>
      : never

export interface FunctionComponent<P = {}> {
  (props: P): SparkNode
}

type JSXElementConstructor<P> = ((props: P) => SparkNode) | (new (...args: any[]) => Component<P>)

/**
 * Represents a JSX element.
 */
export type SparkElement<
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

export type AwaitedSparkNode =
  | SparkElement
  | string
  | number
  | bigint
  | Iterable<SparkNode>
  | boolean
  | null
  | undefined

/**
 * Represents all of the things Spark can render.
 *
 * Where {@link SparkElement} only represents JSX, `SparkNode` represents all of the things Spark can render.
 */
export type SparkNode =
  | SparkElement
  | string
  | number
  | bigint
  | Iterable<SparkNode>
  | boolean
  | null
  | undefined
  | Promise<AwaitedSparkNode>
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

    interface Element extends SparkElement<any, any> {}

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
