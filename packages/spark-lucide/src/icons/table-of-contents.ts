import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M16 12H3', key: '1a2rj7' }],
  ['path', { d: 'M16 18H3', key: '12xzn7' }],
  ['path', { d: 'M16 6H3', key: '1wxfjs' }],
  ['path', { d: 'M21 12h.01', key: 'msek7k' }],
  ['path', { d: 'M21 18h.01', key: '1e8rq1' }],
  ['path', { d: 'M21 6h.01', key: '1koanj' }],
]

/**
 * @component @name TableOfContents
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgMTJIMyIgLz4KICA8cGF0aCBkPSJNMTYgMThIMyIgLz4KICA8cGF0aCBkPSJNMTYgNkgzIiAvPgogIDxwYXRoIGQ9Ik0yMSAxMmguMDEiIC8+CiAgPHBhdGggZD0iTTIxIDE4aC4wMSIgLz4KICA8cGF0aCBkPSJNMjEgNmguMDEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/table-of-contents
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const TableOfContents = createLucideIcon('table-of-contents', __iconNode)

export default TableOfContents
