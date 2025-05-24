import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M8.43 8.43 3 11l8 2 2 8 2.57-5.43', key: '1vdtb7' }],
  ['path', { d: 'M17.39 11.73 22 2l-9.73 4.61', key: 'tya3r6' }],
  ['line', { x1: '2', x2: '22', y1: '2', y2: '22', key: 'a6p6uj' }],
]

/**
 * @component @name NavigationOff
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOC40MyA4LjQzIDMgMTFsOCAyIDIgOCAyLjU3LTUuNDMiIC8+CiAgPHBhdGggZD0iTTE3LjM5IDExLjczIDIyIDJsLTkuNzMgNC42MSIgLz4KICA8bGluZSB4MT0iMiIgeDI9IjIyIiB5MT0iMiIgeTI9IjIyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/navigation-off
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const NavigationOff = createLucideIcon('navigation-off', __iconNode)

export default NavigationOff
