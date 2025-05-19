import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '11', cy: '11', r: '8', key: '4ej97u' }],
  ['line', { x1: '21', x2: '16.65', y1: '21', y2: '16.65', key: '13gj7c' }],
  ['line', { x1: '8', x2: '14', y1: '11', y2: '11', key: 'durymu' }],
]

/**
 * @component @name ZoomOut
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMSIgY3k9IjExIiByPSI4IiAvPgogIDxsaW5lIHgxPSIyMSIgeDI9IjE2LjY1IiB5MT0iMjEiIHkyPSIxNi42NSIgLz4KICA8bGluZSB4MT0iOCIgeDI9IjE0IiB5MT0iMTEiIHkyPSIxMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/zoom-out
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const ZoomOut = createLucideIcon('zoom-out', __iconNode)

export default ZoomOut
