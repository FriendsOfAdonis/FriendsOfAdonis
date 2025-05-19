import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
  ['line', { x1: '10', x2: '10', y1: '15', y2: '9', key: 'c1nkhi' }],
  ['line', { x1: '14', x2: '14', y1: '15', y2: '9', key: 'h65svq' }],
]

/**
 * @component @name CirclePause
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8bGluZSB4MT0iMTAiIHgyPSIxMCIgeTE9IjE1IiB5Mj0iOSIgLz4KICA8bGluZSB4MT0iMTQiIHgyPSIxNCIgeTE9IjE1IiB5Mj0iOSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/circle-pause
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const CirclePause = createLucideIcon('circle-pause', __iconNode)

export default CirclePause
