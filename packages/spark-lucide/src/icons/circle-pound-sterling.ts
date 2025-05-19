import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M10 16V9.5a1 1 0 0 1 5 0', key: '1i1are' }],
  ['path', { d: 'M8 12h4', key: 'qz6y1c' }],
  ['path', { d: 'M8 16h7', key: 'sbedsn' }],
  ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
]

/**
 * @component @name CirclePoundSterling
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTZWOS41YTEgMSAwIDAgMSA1IDAiIC8+CiAgPHBhdGggZD0iTTggMTJoNCIgLz4KICA8cGF0aCBkPSJNOCAxNmg3IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/circle-pound-sterling
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const CirclePoundSterling = createLucideIcon('circle-pound-sterling', __iconNode)

export default CirclePoundSterling
