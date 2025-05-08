import { VNODE_HTML_TAG, VNODE_SYMBOL } from '../symbols.js'
import { OsmosElement } from './types/jsx.js'

/**
 * Renders unsafe raw HTML.
 * Be careful when using this as it can be subject to XSS attacks.
 */
export function html(raw: TemplateStringsArray, ...values: unknown[]): OsmosElement {
  return {
    $$typeof: VNODE_SYMBOL,
    type: VNODE_HTML_TAG,
    props: {
      innerHTML: String.raw({ raw }, ...values),
    },
  }
}
