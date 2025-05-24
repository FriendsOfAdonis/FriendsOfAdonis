import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['line', { x1: '9', x2: '9', y1: '4', y2: '20', key: 'ovs5a5' }],
  ['path', { d: 'M4 7c0-1.7 1.3-3 3-3h13', key: '10pag4' }],
  ['path', { d: 'M18 20c-1.7 0-3-1.3-3-3V4', key: '1gaosr' }],
]

/**
 * @component @name Pi
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iOSIgeDI9IjkiIHkxPSI0IiB5Mj0iMjAiIC8+CiAgPHBhdGggZD0iTTQgN2MwLTEuNyAxLjMtMyAzLTNoMTMiIC8+CiAgPHBhdGggZD0iTTE4IDIwYy0xLjcgMC0zLTEuMy0zLTNWNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/pi
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Pi = createLucideIcon('pi', __iconNode)

export default Pi
