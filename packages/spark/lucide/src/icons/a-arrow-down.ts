import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M3.5 13h6', key: 'p1my2r' }],
  ['path', { d: 'm2 16 4.5-9 4.5 9', key: 'ndf0b3' }],
  ['path', { d: 'M18 7v9', key: 'pknjwm' }],
  ['path', { d: 'm14 12 4 4 4-4', key: 'buelq4' }],
]

/**
 * @component @name AArrowDown
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMy41IDEzaDYiIC8+CiAgPHBhdGggZD0ibTIgMTYgNC41LTkgNC41IDkiIC8+CiAgPHBhdGggZD0iTTE4IDd2OSIgLz4KICA8cGF0aCBkPSJtMTQgMTIgNCA0IDQtNCIgLz4KPC9zdmc+) - https://lucide.dev/icons/a-arrow-down
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const AArrowDown = createLucideIcon('a-arrow-down', __iconNode)

export default AArrowDown
