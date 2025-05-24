import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'm16 6 4 14', key: 'ji33uf' }],
  ['path', { d: 'M12 6v14', key: '1n7gus' }],
  ['path', { d: 'M8 8v12', key: '1gg7y9' }],
  ['path', { d: 'M4 4v16', key: '6qkkli' }],
]

/**
 * @component @name Library
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTYgNiA0IDE0IiAvPgogIDxwYXRoIGQ9Ik0xMiA2djE0IiAvPgogIDxwYXRoIGQ9Ik04IDh2MTIiIC8+CiAgPHBhdGggZD0iTTQgNHYxNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/library
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Library = createLucideIcon('library', __iconNode)

export default Library
