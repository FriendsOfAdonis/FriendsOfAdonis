import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'm14 6 4 4', key: '1q72g9' }],
  ['path', { d: 'M17 3h4v4', key: '19p9u1' }],
  ['path', { d: 'm21 3-7.75 7.75', key: '1cjbfd' }],
  ['circle', { cx: '9', cy: '15', r: '6', key: 'bx5svt' }],
]

/**
 * @component @name MarsStroke
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTQgNiA0IDQiIC8+CiAgPHBhdGggZD0iTTE3IDNoNHY0IiAvPgogIDxwYXRoIGQ9Im0yMSAzLTcuNzUgNy43NSIgLz4KICA8Y2lyY2xlIGN4PSI5IiBjeT0iMTUiIHI9IjYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/mars-stroke
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const MarsStroke = createLucideIcon('mars-stroke', __iconNode)

export default MarsStroke
