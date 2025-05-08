import { OsmosElement } from '@foadonis/osmos/jsx-runtime'
import { VNODE_HEAD_SYMBOL } from '../symbols.js'

export function Head(_props: { children?: OsmosElement }) {
  return null
  // return {
  //   $$typeof: VNODE_HEAD_SYMBOL,
  //   type: null,
  //   props: { children },
  // } as unknown as VNode
}

// TODO: I think it is not used anymore
Head[VNODE_HEAD_SYMBOL] = true
