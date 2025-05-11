import { VNODE_HEAD_SYMBOL } from '../jsx/symbols.js'
import { SparkNode } from '../jsx/types/jsx.js'

export function Head(_props: { children?: SparkNode }) {
  return null
  // return {
  //   $$typeof: VNODE_HEAD_SYMBOL,
  //   type: null,
  //   props: { children },
  // } as unknown as VNode
}

// TODO: I think it is not used anymore
Head[VNODE_HEAD_SYMBOL] = true
