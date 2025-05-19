import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['polygon', { points: '12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2', key: 'srzb37' }],
  ['line', { x1: '12', x2: '12', y1: '22', y2: '15.5', key: '1t73f2' }],
  ['polyline', { points: '22 8.5 12 15.5 2 8.5', key: 'ajlxae' }],
  ['polyline', { points: '2 15.5 12 8.5 22 15.5', key: 'susrui' }],
  ['line', { x1: '12', x2: '12', y1: '2', y2: '8.5', key: '2cldga' }],
]

/**
 * @component @name Codepen
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cG9seWdvbiBwb2ludHM9IjEyIDIgMjIgOC41IDIyIDE1LjUgMTIgMjIgMiAxNS41IDIgOC41IDEyIDIiIC8+CiAgPGxpbmUgeDE9IjEyIiB4Mj0iMTIiIHkxPSIyMiIgeTI9IjE1LjUiIC8+CiAgPHBvbHlsaW5lIHBvaW50cz0iMjIgOC41IDEyIDE1LjUgMiA4LjUiIC8+CiAgPHBvbHlsaW5lIHBvaW50cz0iMiAxNS41IDEyIDguNSAyMiAxNS41IiAvPgogIDxsaW5lIHgxPSIxMiIgeDI9IjEyIiB5MT0iMiIgeTI9IjguNSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/codepen
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 * @deprecated Brand icons have been deprecated and are due to be removed, please refer to https://github.com/lucide-icons/lucide/issues/670. We recommend using https://simpleicons.org/?q=codepen instead. This icon will be removed in v1.0
 */
const Codepen = createLucideIcon('codepen', __iconNode)

export default Codepen
