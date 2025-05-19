import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['polyline', { points: '14.5 17.5 3 6 3 3 6 3 17.5 14.5', key: '1hfsw2' }],
  ['line', { x1: '13', x2: '19', y1: '19', y2: '13', key: '1vrmhu' }],
  ['line', { x1: '16', x2: '20', y1: '16', y2: '20', key: '1bron3' }],
  ['line', { x1: '19', x2: '21', y1: '21', y2: '19', key: '13pww6' }],
]

/**
 * @component @name Sword
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cG9seWxpbmUgcG9pbnRzPSIxNC41IDE3LjUgMyA2IDMgMyA2IDMgMTcuNSAxNC41IiAvPgogIDxsaW5lIHgxPSIxMyIgeDI9IjE5IiB5MT0iMTkiIHkyPSIxMyIgLz4KICA8bGluZSB4MT0iMTYiIHgyPSIyMCIgeTE9IjE2IiB5Mj0iMjAiIC8+CiAgPGxpbmUgeDE9IjE5IiB4Mj0iMjEiIHkxPSIyMSIgeTI9IjE5IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/sword
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Sword = createLucideIcon('sword', __iconNode)

export default Sword
