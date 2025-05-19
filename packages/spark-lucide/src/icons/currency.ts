import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '12', cy: '12', r: '8', key: '46899m' }],
  ['line', { x1: '3', x2: '6', y1: '3', y2: '6', key: '1jkytn' }],
  ['line', { x1: '21', x2: '18', y1: '3', y2: '6', key: '14zfjt' }],
  ['line', { x1: '3', x2: '6', y1: '21', y2: '18', key: 'iusuec' }],
  ['line', { x1: '21', x2: '18', y1: '21', y2: '18', key: 'yj2dd7' }],
]

/**
 * @component @name Currency
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiAvPgogIDxsaW5lIHgxPSIzIiB4Mj0iNiIgeTE9IjMiIHkyPSI2IiAvPgogIDxsaW5lIHgxPSIyMSIgeDI9IjE4IiB5MT0iMyIgeTI9IjYiIC8+CiAgPGxpbmUgeDE9IjMiIHgyPSI2IiB5MT0iMjEiIHkyPSIxOCIgLz4KICA8bGluZSB4MT0iMjEiIHgyPSIxOCIgeTE9IjIxIiB5Mj0iMTgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/currency
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Currency = createLucideIcon('currency', __iconNode)

export default Currency
