import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
  ['path', { d: 'M16 16s-1.5-2-4-2-4 2-4 2', key: 'epbg0q' }],
  ['line', { x1: '9', x2: '9.01', y1: '9', y2: '9', key: 'yxxnd0' }],
  ['line', { x1: '15', x2: '15.01', y1: '9', y2: '9', key: '1p4y9e' }],
]

/**
 * @component @name Frown
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNMTYgMTZzLTEuNS0yLTQtMi00IDItNCAyIiAvPgogIDxsaW5lIHgxPSI5IiB4Mj0iOS4wMSIgeTE9IjkiIHkyPSI5IiAvPgogIDxsaW5lIHgxPSIxNSIgeDI9IjE1LjAxIiB5MT0iOSIgeTI9IjkiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/frown
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Frown = createLucideIcon('frown', __iconNode)

export default Frown
