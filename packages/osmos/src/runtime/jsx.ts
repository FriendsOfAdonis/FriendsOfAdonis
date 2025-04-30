import { VNODE_SYMBOL } from '../symbols.js'
import { VNode } from './types/jsx.js'

function jsx(tag: VNode['type'], props: any, key?: string | number): VNode {
  if (key !== undefined) {
    props.key = key
  }

  return {
    $$typeof: VNODE_SYMBOL,
    type: tag,
    props,
  }
}

export { jsx, jsx as jsxs }
