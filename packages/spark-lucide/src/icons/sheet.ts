import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2', ry: '2', key: '1m3agn' }],
  ['line', { x1: '3', x2: '21', y1: '9', y2: '9', key: '1vqk6q' }],
  ['line', { x1: '3', x2: '21', y1: '15', y2: '15', key: 'o2sbyz' }],
  ['line', { x1: '9', x2: '9', y1: '9', y2: '21', key: '1ib60c' }],
  ['line', { x1: '15', x2: '15', y1: '9', y2: '21', key: '1n26ft' }],
]

/**
 * @component @name Sheet
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIgLz4KICA8bGluZSB4MT0iMyIgeDI9IjIxIiB5MT0iOSIgeTI9IjkiIC8+CiAgPGxpbmUgeDE9IjMiIHgyPSIyMSIgeTE9IjE1IiB5Mj0iMTUiIC8+CiAgPGxpbmUgeDE9IjkiIHgyPSI5IiB5MT0iOSIgeTI9IjIxIiAvPgogIDxsaW5lIHgxPSIxNSIgeDI9IjE1IiB5MT0iOSIgeTI9IjIxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/sheet
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Sheet = createLucideIcon('sheet', __iconNode)

export default Sheet
