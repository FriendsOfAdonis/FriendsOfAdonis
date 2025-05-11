import { SparkElement, SparkNode } from '../types/jsx.js'
import { VNODE_HEAD_SYMBOL } from '../symbols.js'
import { isJSXElement } from './jsx_element.js'

export function collectHeads(node: SparkNode, heads: SparkElement[] = []) {
  const nodes = [node].flat()

  for (const n of nodes) {
    if (!isJSXElement(n)) continue

    const props = n.props as any
    if (typeof n.type === 'function' && VNODE_HEAD_SYMBOL in n.type) {
      heads.push(...[props.children].flat())
    } else if (props.children) {
      collectHeads(props.children, heads)
    }
  }

  return heads
}
