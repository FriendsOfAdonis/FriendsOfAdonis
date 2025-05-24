import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '16', height: '10', x: '2', y: '7', rx: '2', ry: '2', key: '1w10f2' }],
  ['line', { x1: '22', x2: '22', y1: '11', y2: '13', key: '4dh1rd' }],
]

/**
 * @component @name Battery
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTAiIHg9IjIiIHk9IjciIHJ4PSIyIiByeT0iMiIgLz4KICA8bGluZSB4MT0iMjIiIHgyPSIyMiIgeTE9IjExIiB5Mj0iMTMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/battery
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Battery = createLucideIcon('battery', __iconNode)

export default Battery
