// @ts-expect-error
import HtmlCreator from 'html-creator'
import { BaseComponent } from '../component/main.js'
import * as devalue from 'devalue'
import { ComponentsRegistry } from '../component/registry.js'
import { inspect } from 'node:util'
import { AsyncLocalStorage } from 'node:async_hooks'
import { ComponentContext } from '../types.js'
import { VNode } from './types/jsx.js'
import { isRef, ref } from '../ref.js'
import { REF_SYMBOL, VNODE_SYMBOL } from '../symbols.js'

export type RenderContext = {
  registry: ComponentsRegistry
  children?: ComponentContext[]
}

export const LocalStorage = new AsyncLocalStorage<boolean>()

type Node = null | undefined | boolean | string | bigint | number | boolean | JSX.Element

export async function renderToString(node: Node | Node[], context: RenderContext): Promise<string> {
  if (node === null || node === undefined) {
    return ''
  }

  // Booleans are not rendered to make ternaries usable.
  if (typeof node === 'boolean') {
    return ''
  }

  if (
    typeof node === 'string' ||
    typeof node === 'bigint' ||
    typeof node === 'number' ||
    typeof node === 'boolean'
  ) {
    return node.toString()
  }

  if (isRef(node)) {
    return node.toString()
  }

  if (isVnode(node)) {
    return renderVNodeToString(node, context)
  }

  if (Array.isArray(node)) {
    const p = node.map((n) => renderToString(n, context))
    return Promise.all(p).then((r) => r.join(''))
  }

  if ('then' in node) {
    const result = await node
    return renderToString(result, context)
  }

  throw new Error(`Invalid element ${inspect(node)}`)
}

/**
 * Render a VNode (JSX.Element).
 */
function renderVNodeToString(node: VNode, context: RenderContext): Promise<string> {
  if (typeof node.type === 'string') {
    return renderHTMLElementToString(node.type, node.props, context)
  }

  if (node.type.prototype instanceof BaseComponent) {
    const component = new (node.type as any)()
    return renderComponentToString(component, node.props, context)
  }

  if (typeof node.type === 'function') {
    return renderToString(node.type(node.props), context)
  }

  throw new Error(`renderVNodeToString does not handle type ${inspect(node)}`)
}

/**
 * Renders an HTMLElement.
 *
 * @example
 * renderHTMLElementToString('div') === '<div></div>'
 */
async function renderHTMLElementToString(tag: string, props: any = {}, context: RenderContext) {
  const { children, className, $click, $model, $lazy, ...attributes } = props

  if ($click && isRef($click)) {
    attributes['x-on:click'] = `$osmos.action('${$click[REF_SYMBOL]}')`
  }

  if ($model && isRef($model)) {
    attributes['x-on:keyup'] = `$osmos.model('${$model[REF_SYMBOL]}', $event)`
    attributes['value'] = $model.toString()
  }

  const html = new HtmlCreator([
    {
      type: tag,
      attributes: {
        class: className,
        ...attributes,
      },
      content: await renderToString(children, context),
    },
  ])

  return html.renderHTML({ excludeHTMLtag: true })
}

export async function renderComponentToString(
  component: BaseComponent,
  props: any,
  context: RenderContext
) {
  const { $lazy, ...rest } = props

  component.props = rest

  const proxy = new Proxy(component, {
    get(obj, prop) {
      if (typeof prop === 'symbol') throw new Error('You cannot do that on symbol') // TODO: Error
      if (!(prop in obj))
        throw new Error(`Cannot create ref has object does not have property ${prop}`)

      const value = obj[prop as keyof typeof obj]

      return ref(prop, value)
    },
  })

  let child: ComponentContext | undefined
  if (context.children) {
    child = context.children.shift()
    if (child) component.$hydrate(child?.data)
  }

  const result = await component.render.call(proxy)

  context.registry.register(component.constructor as any)

  const data = component.$data()
  const attributes: Record<string, string> = {
    'osmos:data': devalue.uneval(data).replaceAll('\"', "'"),
    'osmos:id': component.$id,
    'osmos:component': component.constructor.$id,
    'children': result,
  }

  if ($lazy) {
    attributes['osmos:lazy'] = ''
    attributes['children'] = ''
  }

  return renderHTMLElementToString('osmos-component', attributes, {
    registry: context.registry,
    children: component.$childrenData,
  })
}

/**
 * Returns if a value is a VNode
 */
export function isVnode(value: unknown): value is VNode {
  return (
    value !== null &&
    typeof value === 'object' &&
    '$$typeof' in value &&
    value.$$typeof === VNODE_SYMBOL
  )
}
