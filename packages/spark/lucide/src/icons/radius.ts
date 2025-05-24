import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M20.34 17.52a10 10 0 1 0-2.82 2.82', key: 'fydyku' }],
  ['circle', { cx: '19', cy: '19', r: '2', key: '17f5cg' }],
  ['path', { d: 'm13.41 13.41 4.18 4.18', key: '1gqbwc' }],
  ['circle', { cx: '12', cy: '12', r: '2', key: '1c9p78' }],
]

/**
 * @component @name Radius
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAuMzQgMTcuNTJhMTAgMTAgMCAxIDAtMi44MiAyLjgyIiAvPgogIDxjaXJjbGUgY3g9IjE5IiBjeT0iMTkiIHI9IjIiIC8+CiAgPHBhdGggZD0ibTEzLjQxIDEzLjQxIDQuMTggNC4xOCIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/radius
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Radius = createLucideIcon('radius', __iconNode)

export default Radius
