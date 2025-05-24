import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2', ry: '2', key: '1m3agn' }],
  ['line', { x1: '8', x2: '16', y1: '12', y2: '12', key: '1jonct' }],
  ['line', { x1: '12', x2: '12', y1: '16', y2: '16', key: 'aqc6ln' }],
  ['line', { x1: '12', x2: '12', y1: '8', y2: '8', key: '1mkcni' }],
]

/**
 * @component @name SquareDivide
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIgLz4KICA8bGluZSB4MT0iOCIgeDI9IjE2IiB5MT0iMTIiIHkyPSIxMiIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjE2IiB5Mj0iMTYiIC8+CiAgPGxpbmUgeDE9IjEyIiB4Mj0iMTIiIHkxPSI4IiB5Mj0iOCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/square-divide
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const SquareDivide = createLucideIcon('square-divide', __iconNode)

export default SquareDivide
