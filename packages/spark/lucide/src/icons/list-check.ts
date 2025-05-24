import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M11 18H3', key: 'n3j2dh' }],
  ['path', { d: 'm15 18 2 2 4-4', key: '1szwhi' }],
  ['path', { d: 'M16 12H3', key: '1a2rj7' }],
  ['path', { d: 'M16 6H3', key: '1wxfjs' }],
]

/**
 * @component @name ListCheck
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEgMThIMyIgLz4KICA8cGF0aCBkPSJtMTUgMTggMiAyIDQtNCIgLz4KICA8cGF0aCBkPSJNMTYgMTJIMyIgLz4KICA8cGF0aCBkPSJNMTYgNkgzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/list-check
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const ListCheck = createLucideIcon('list-check', __iconNode)

export default ListCheck
