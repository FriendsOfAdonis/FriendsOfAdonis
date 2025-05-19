import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M8 2c3 0 5 2 8 2s4-1 4-1v11', key: '9rwyz9' }],
  ['path', { d: 'M4 22V4', key: '1plyxx' }],
  ['path', { d: 'M4 15s1-1 4-1 5 2 8 2', key: '1myooe' }],
  ['line', { x1: '2', x2: '22', y1: '2', y2: '22', key: 'a6p6uj' }],
]

/**
 * @component @name FlagOff
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOCAyYzMgMCA1IDIgOCAyczQtMSA0LTF2MTEiIC8+CiAgPHBhdGggZD0iTTQgMjJWNCIgLz4KICA8cGF0aCBkPSJNNCAxNXMxLTEgNC0xIDUgMiA4IDIiIC8+CiAgPGxpbmUgeDE9IjIiIHgyPSIyMiIgeTE9IjIiIHkyPSIyMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/flag-off
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const FlagOff = createLucideIcon('flag-off', __iconNode)

export default FlagOff
