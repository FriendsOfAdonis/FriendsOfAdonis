import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['polygon', { points: '5 4 15 12 5 20 5 4', key: '16p6eg' }],
  ['line', { x1: '19', x2: '19', y1: '5', y2: '19', key: 'futhcm' }],
]

/**
 * @component @name SkipForward
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cG9seWdvbiBwb2ludHM9IjUgNCAxNSAxMiA1IDIwIDUgNCIgLz4KICA8bGluZSB4MT0iMTkiIHgyPSIxOSIgeTE9IjUiIHkyPSIxOSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/skip-forward
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const SkipForward = createLucideIcon('skip-forward', __iconNode)

export default SkipForward
