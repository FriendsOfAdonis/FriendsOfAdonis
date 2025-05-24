import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M5 7v11a1 1 0 0 0 1 1h11', key: '13dt1j' }],
  ['path', { d: 'M5.293 18.707 11 13', key: 'ezgbsx' }],
  ['circle', { cx: '19', cy: '19', r: '2', key: '17f5cg' }],
  ['circle', { cx: '5', cy: '5', r: '2', key: '1gwv83' }],
]

/**
 * @component @name Scale3d
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSA3djExYTEgMSAwIDAgMCAxIDFoMTEiIC8+CiAgPHBhdGggZD0iTTUuMjkzIDE4LjcwNyAxMSAxMyIgLz4KICA8Y2lyY2xlIGN4PSIxOSIgY3k9IjE5IiByPSIyIiAvPgogIDxjaXJjbGUgY3g9IjUiIGN5PSI1IiByPSIyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/scale-3d
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Scale3d = createLucideIcon('scale-3d', __iconNode)

export default Scale3d
