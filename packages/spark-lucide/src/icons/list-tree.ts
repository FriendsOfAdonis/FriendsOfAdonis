import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M21 12h-8', key: '1bmf0i' }],
  ['path', { d: 'M21 6H8', key: '1pqkrb' }],
  ['path', { d: 'M21 18h-8', key: '1tm79t' }],
  ['path', { d: 'M3 6v4c0 1.1.9 2 2 2h3', key: '1ywdgy' }],
  ['path', { d: 'M3 10v6c0 1.1.9 2 2 2h3', key: '2wc746' }],
]

/**
 * @component @name ListTree
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgMTJoLTgiIC8+CiAgPHBhdGggZD0iTTIxIDZIOCIgLz4KICA8cGF0aCBkPSJNMjEgMThoLTgiIC8+CiAgPHBhdGggZD0iTTMgNnY0YzAgMS4xLjkgMiAyIDJoMyIgLz4KICA8cGF0aCBkPSJNMyAxMHY2YzAgMS4xLjkgMiAyIDJoMyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/list-tree
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const ListTree = createLucideIcon('list-tree', __iconNode)

export default ListTree
