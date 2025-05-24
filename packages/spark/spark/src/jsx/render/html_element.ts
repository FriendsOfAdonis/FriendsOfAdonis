import escapeHTML from 'escape-html'
import { toAlpineEventAttributes } from './alpine.js'
import { render, RenderContext } from './main.js'
import { jsx } from '../runtime/jsx.js'
import { html } from '../tags.js'

const selfClosingTags = new Set(
  'area,base,br,col,embed,hr,img,input,keygen,link,meta,param,source,track,wbr'.split(',')
)

/**
 * Renders an HTMLElement.
 *
 * @example
 * renderHTMLElementToString('div') === '<div></div>'
 */
export async function renderHTMLElement(
  tag: string,
  props: any = {},
  context: RenderContext
): Promise<void> {
  let { children, className, $lazy, ...attributes } = props

  attributes = toAlpineEventAttributes(attributes)

  attributes['class'] = className

  if (tag === 'head') {
    // TODO: This will fail if single children
    const idScript = jsx('script', {
      children: html`window.__spark_id = "${context.spark.id}"`,
    })

    children = [...(children ? [children] : []).flat(), ...(context.head ?? []), idScript].flat()
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
