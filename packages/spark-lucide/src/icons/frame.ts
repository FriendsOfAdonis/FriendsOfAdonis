import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['line', { x1: '22', x2: '2', y1: '6', y2: '6', key: '15w7dq' }],
  ['line', { x1: '22', x2: '2', y1: '18', y2: '18', key: '1ip48p' }],
  ['line', { x1: '6', x2: '6', y1: '2', y2: '22', key: 'a2lnyx' }],
  ['line', { x1: '18', x2: '18', y1: '2', y2: '22', key: '8vb6jd' }],
]

/**
 * @component @name Frame
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iMjIiIHgyPSIyIiB5MT0iNiIgeTI9IjYiIC8+CiAgPGxpbmUgeDE9IjIyIiB4Mj0iMiIgeTE9IjE4IiB5Mj0iMTgiIC8+CiAgPGxpbmUgeDE9IjYiIHgyPSI2IiB5MT0iMiIgeTI9IjIyIiAvPgogIDxsaW5lIHgxPSIxOCIgeDI9IjE4IiB5MT0iMiIgeTI9IjIyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/frame
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Frame = createLucideIcon('frame', __iconNode)

export default Frame
