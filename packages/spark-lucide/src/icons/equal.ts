import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['line', { x1: '5', x2: '19', y1: '9', y2: '9', key: '1nwqeh' }],
  ['line', { x1: '5', x2: '19', y1: '15', y2: '15', key: 'g8yjpy' }],
]

/**
 * @component @name Equal
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iNSIgeDI9IjE5IiB5MT0iOSIgeTI9IjkiIC8+CiAgPGxpbmUgeDE9IjUiIHgyPSIxOSIgeTE9IjE1IiB5Mj0iMTUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/equal
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Equal = createLucideIcon('equal', __iconNode)

export default Equal
