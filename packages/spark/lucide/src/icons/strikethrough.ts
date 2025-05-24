import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M16 4H9a3 3 0 0 0-2.83 4', key: '43sutm' }],
  ['path', { d: 'M14 12a4 4 0 0 1 0 8H6', key: 'nlfj13' }],
  ['line', { x1: '4', x2: '20', y1: '12', y2: '12', key: '1e0a9i' }],
]

/**
 * @component @name Strikethrough
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgNEg5YTMgMyAwIDAgMC0yLjgzIDQiIC8+CiAgPHBhdGggZD0iTTE0IDEyYTQgNCAwIDAgMSAwIDhINiIgLz4KICA8bGluZSB4MT0iNCIgeDI9IjIwIiB5MT0iMTIiIHkyPSIxMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/strikethrough
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Strikethrough = createLucideIcon('strikethrough', __iconNode)

export default Strikethrough
