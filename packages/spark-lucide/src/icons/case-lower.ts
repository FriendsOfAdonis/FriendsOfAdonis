import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '7', cy: '12', r: '3', key: '12clwm' }],
  ['path', { d: 'M10 9v6', key: '17i7lo' }],
  ['circle', { cx: '17', cy: '12', r: '3', key: 'gl7c2s' }],
  ['path', { d: 'M14 7v8', key: 'dl84cr' }],
]

/**
 * @component @name CaseLower
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSI3IiBjeT0iMTIiIHI9IjMiIC8+CiAgPHBhdGggZD0iTTEwIDl2NiIgLz4KICA8Y2lyY2xlIGN4PSIxNyIgY3k9IjEyIiByPSIzIiAvPgogIDxwYXRoIGQ9Ik0xNCA3djgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/case-lower
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const CaseLower = createLucideIcon('case-lower', __iconNode)

export default CaseLower
