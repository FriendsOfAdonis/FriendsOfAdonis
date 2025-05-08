import * as devalue from 'devalue'
import { ComponentsRegistry } from '../components/registry.js'
import { inspect } from 'node:util'
import { AsyncLocalStorage } from 'node:async_hooks'
import { ComponentContext } from '../types.js'
import { OsmosElement, OsmosNode } from './types/jsx.js'
import { createRefProxyAccessor, isRef } from '../ref.js'
import { VNODE_HEAD_SYMBOL, VNODE_FRAGMENT_SYMBOL, VNODE_HTML_TAG } from '../symbols.js'
import { collectHeads } from './head.js'
import escapeHTML from 'escape-html'
import { ReadableStream } from 'node:stream/web'
import { toAlpineEventAttributes } from './alpine.js'
import is from '@sindresorhus/is'
import JSXRenderError from '../errors/jsx_render_error.js'
import { Component } from '../components/main.js'

export type RenderContext = {
  registry: ComponentsRegistry
  functions: Map<string, Function>
  head?: OsmosElement[]
  children?: ComponentContext[]
  write: (chunk: string) => void
  onError: (err: unknown) => void
}

export type PipeableStream = {
  abort: (reason?: unknown) => void
  pipe: <Writable extends WritableStream>(destination: Writable) => Writable
}

export const LocalStorage = new AsyncLocalStorage<boolean>()

const encoder = new TextEncoder()
const selfClosingTags = new Set(
  'area,base,br,col,embed,hr,img,input,keygen,link,meta,param,source,track,wbr'.split(',')
)

/**
 * Renders Osmos tree to an HTML string.
 */
export async function renderToString(
  node: OsmosNode,
  context: { registry: ComponentsRegistry }
): Promise<string> {
  let output = ''

  await render(node, {
    registry: context.registry,
    functions: new Map(),
    write: (chunk) => {
      output += chunk
    },
    onError: (err) => {
      console.warn(err)
    },
  })

  return output
}

/**
 * Renders Osmos tree to a Readable Node Stream.
 */
export function renderToReadableStream(
  node: OsmosNode,
  context: { registry: ComponentsRegistry }
): ReadableStream {
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const write = (chunk: string) => controller.enqueue(encoder.encode(chunk))
      const functions = new Map()

      await render(node, {
        registry: context.registry,
        functions,
        write,
        onError: (err) => {
          console.warn(err)
        },
      })

      write(`<script>`)
      write(`const __osmos_events = {}\n`)

      functions.forEach((value, key) => {
        write(`__osmos_events["${key}"] = "${value}"\n`)
      })

      write(`</script>`)

      controller.close()
    },
  })

  return stream
}

async function render(node: OsmosNode, context: RenderContext): Promise<void> {
  if (!context.head) {
    context.head = collectHeads(node)
  }

  if (node === null || node === undefined) {
    return context.write('')
  }

  // Booleans are not rendered to make ternaries usable.
  if (typeof node === 'boolean') {
    return context.write('')
  }

  if (typeof node === 'string' || typeof node === 'bigint' || typeof node === 'number') {
    return context.write(escapeHTML(node.toString()))
  }

  if (isRef(node)) {
    // TODO: Remove as OsmosNode
    return render(node.value as OsmosNode, context)
  }

  if (isVnode(node)) {
    return renderVNodeToString(node, context)
  }

  if (is.iterable(node)) {
    for (const n of node) {
      await render(n, context)
    }
    return
  }

  if (is.promise(node)) {
    const result = await node
    return render(result, context)
  }

  return renderComponentToString(node, {}, context)
}

/**
 * Render a VNode (JSX.Element).
 */
async function renderVNodeToString(node: OsmosElement, context: RenderContext): Promise<void> {
  if (typeof node.type === 'string') {
    return renderHTMLElementToString(node.type, node.props, context)
  }

  if (is.symbol(node.type)) {
    if (node.type === VNODE_HTML_TAG) {
      if (!('innerHTML' in node.props) || typeof node.props.innerHTML !== 'string') {
        context.onError(new JSXRenderError('innerHTML is required for VNODE_HTML_TAG'))
        return
      }

      return context.write(node.props.innerHTML)
    }

    if (node.type === VNODE_HEAD_SYMBOL) {
      return
    }

    if (node.type === VNODE_FRAGMENT_SYMBOL) {
      if (!('children' in node.props)) {
        context.onError(new JSXRenderError('innerHTML is required for VNODE_HTML_TAG'))
        return
      }

      return render(node.props.children as OsmosNode, context)
    }
  }

  if (is.class(node.type)) {
    const component = new node.type()
    return renderComponentToString(component, node.props, context)
  }

  if (is.function(node.type)) {
    return render(node.type(node.props), context)
  }

  context.onError(new JSXRenderError(`renderVNodeToString does not handle type ${inspect(node)}`))
}

/**
 * Renders an HTMLElement.
 *
 * @example
 * renderHTMLElementToString('div') === '<div></div>'
 */
async function renderHTMLElementToString(
  tag: string,
  props: any = {},
  context: RenderContext
): Promise<void> {
  let { children, className, $lazy, ...attributes } = props

  attributes = toAlpineEventAttributes(attributes)

  attributes['class'] = className

  if (tag === 'head') {
    // TODO: This will fail if single children
    children = [...(children ?? []), ...(context.head ?? [])].flat()
  }

  let buffer = `<${tag}`

  for (const [key, value] of Object.entries(attributes)) {
    if (value === undefined) continue
    if (typeof value === 'boolean' && value) {
      buffer += ` ${key}`
    } else {
      buffer += ` ${escapeHTML(key)}="${value}"`
    }
  }

  if (children || !selfClosingTags.has(tag)) {
    buffer += `>`

    context.write(buffer)

    if (children) {
      await render(children, context)
    }

    context.write(`</${tag}>`)
  } else {
    buffer += ` />`
    context.write(buffer)
  }
}

async function renderComponentToString(
  component: Component<any>,
  props: any,
  context: RenderContext
): Promise<void> {
  const { $lazy, ...rest } = props

  // @ts-expect-error -- Readonly is for user only
  component.$props = rest

  const proxy = createRefProxyAccessor(component)

  let child: ComponentContext | undefined
  if (context.children) {
    child = context.children.shift()
    if (child) component.$hydrate(child?.data)
  }

  const result = await component.render(proxy)

  context.registry.register(component.constructor as any)

  const data = component.$data()

  const attributes: Record<string, any> = {
    'x-data': devalue.uneval(data).replaceAll('\"', "'"),
    'osmos:id': component.$id,
    'osmos:component': (component.constructor as any).$id,
    'children': result,
  }

  if ($lazy) {
    attributes['osmos:lazy'] = ''
    attributes['children'] = ''
  }

  return renderHTMLElementToString('osmos-component', attributes, {
    ...context,
    children: component.$childrenData,
  })
}

/**
 * Returns if a value is a VNode
 */
export function isVnode(value: unknown): value is OsmosElement {
  return (
    value !== null &&
    typeof value === 'object' &&
    '$$typeof' in value &&
    typeof value.$$typeof === 'symbol'
  )
}
