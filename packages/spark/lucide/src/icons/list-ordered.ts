import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M10 12h11', key: '6m4ad9' }],
  ['path', { d: 'M10 18h11', key: '11hvi2' }],
  ['path', { d: 'M10 6h11', key: 'c7qv1k' }],
  ['path', { d: 'M4 10h2', key: '16xx2s' }],
  ['path', { d: 'M4 6h1v4', key: 'cnovpq' }],
  ['path', { d: 'M6 18H4c0-1 2-2 2-3s-1-1.5-2-1', key: 'm9a95d' }],
]

/**
 * @component @name ListOrdered
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTJoMTEiIC8+CiAgPHBhdGggZD0iTTEwIDE4aDExIiAvPgogIDxwYXRoIGQ9Ik0xMCA2aDExIiAvPgogIDxwYXRoIGQ9Ik00IDEwaDIiIC8+CiAgPHBhdGggZD0iTTQgNmgxdjQiIC8+CiAgPHBhdGggZD0iTTYgMThINGMwLTEgMi0yIDItM3MtMS0xLjUtMi0xIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/list-ordered
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const ListOrdered = createLucideIcon('list-ordered', __iconNode)

export default ListOrdered
