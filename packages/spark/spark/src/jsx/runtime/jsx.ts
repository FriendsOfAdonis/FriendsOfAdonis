import { VNODE_FRAGMENT_SYMBOL, VNODE_SYMBOL } from '../symbols.js'
import { FC, SparkElement } from '../types/jsx.js'

function jsx(tag: SparkElement['type'], props: any, key?: string | number): SparkElement {
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

export const Fragment = VNODE_FRAGMENT_SYMBOL as unknown as FC
