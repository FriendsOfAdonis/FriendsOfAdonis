import { ComponentsRegistry } from '../../components/registry.js'
import { ComponentContext } from '../../types.js'
import { SparkElement, SparkNode } from '../types/jsx.js'
import { ReadableStream } from 'node:stream/web'
import { collectHeads } from './head.js'
import escapeHTML from 'escape-html'
import { isRef } from '../../ref.js'
import { isJSXElement, renderJSXElement } from './jsx_element.js'
import is from '@sindresorhus/is'
import { renderComponent } from './component.js'

export type RenderContext = {
  registry: ComponentsRegistry
  functions: Map<string, Function>
  head?: SparkElement[]
  children?: ComponentContext[]
  write: (chunk: string) => void
  onError: (err: unknown) => void
}

const encoder = new TextEncoder()

/**
 * Renders Spark tree to an HTML string.
 */
export async function renderToString(
  node: SparkNode,
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
 * Renders Spark tree to a Readable Node Stream.
 */
export function renderToReadableStream(
  node: SparkNode,
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
      write(`const __spark_events = {}\n`)

      functions.forEach((value, key) => {
        write(`__spark_events["${key}"] = "${value}"\n`)
      })

      write(`</script>`)

      controller.close()
    },
  })

  return stream
}

export async function render(node: SparkNode, context: RenderContext): Promise<void> {
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
    // TODO: Remove as SparkNode
    return render(node.value as SparkNode, context)
  }

  if (isJSXElement(node)) {
    return renderJSXElement(node, context)
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

  return renderComponent(node, {}, context)
}
