import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M22 11v1a10 10 0 1 1-9-10', key: 'ew0xw9' }],
  ['path', { d: 'M8 14s1.5 2 4 2 4-2 4-2', key: '1y1vjs' }],
  ['line', { x1: '9', x2: '9.01', y1: '9', y2: '9', key: 'yxxnd0' }],
  ['line', { x1: '15', x2: '15.01', y1: '9', y2: '9', key: '1p4y9e' }],
  ['path', { d: 'M16 5h6', key: '1vod17' }],
  ['path', { d: 'M19 2v6', key: '4bpg5p' }],
]

/**
 * @component @name SmilePlus
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjIgMTF2MWExMCAxMCAwIDEgMS05LTEwIiAvPgogIDxwYXRoIGQ9Ik04IDE0czEuNSAyIDQgMiA0LTIgNC0yIiAvPgogIDxsaW5lIHgxPSI5IiB4Mj0iOS4wMSIgeTE9IjkiIHkyPSI5IiAvPgogIDxsaW5lIHgxPSIxNSIgeDI9IjE1LjAxIiB5MT0iOSIgeTI9IjkiIC8+CiAgPHBhdGggZD0iTTE2IDVoNiIgLz4KICA8cGF0aCBkPSJNMTkgMnY2IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/smile-plus
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const SmilePlus = createLucideIcon('smile-plus', __iconNode)

export default SmilePlus
