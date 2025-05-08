import { VNODE_FRAGMENT_SYMBOL, VNODE_SYMBOL } from '../symbols.js'
import { FC, OsmosElement } from './types/jsx.js'

function jsx(tag: OsmosElement['type'], props: any, key?: string | number): OsmosElement {
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
