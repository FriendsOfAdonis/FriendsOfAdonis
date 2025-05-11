import is from '@sindresorhus/is'
import JSXRenderError from '../../errors/jsx_render_error.js'
import { VNODE_FRAGMENT_SYMBOL, VNODE_HEAD_SYMBOL, VNODE_HTML_TAG } from '../symbols.js'
import { SparkElement, SparkNode } from '../types/jsx.js'
import { render, RenderContext } from './main.js'
import { inspect } from 'node:util'
import { renderHTMLElement } from './html_element.js'
import { renderComponent } from './component.js'

/**
 * Returns if a value is a JSX.Element
 */
export function isJSXElement(value: unknown): value is JSX.Element {
  return (
    value !== null &&
    typeof value === 'object' &&
    '$$typeof' in value &&
    typeof value.$$typeof === 'symbol'
  )
}

/**
 * Renders a JSX.Element (SparkElement).
 */
export async function renderJSXElement(node: SparkElement, context: RenderContext): Promise<void> {
  if (typeof node.type === 'string') {
    return renderHTMLElement(node.type, node.props, context)
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

      return render(node.props.children as SparkNode, context)
    }
  }

  if (is.class(node.type)) {
    const component = new node.type()
    return renderComponent(component, node.props, context)
  }

  if (is.function(node.type)) {
    return render(node.type(node.props), context)
  }

  context.onError(new JSXRenderError(`renderVNodeToString does not handle type ${inspect(node)}`))
}
