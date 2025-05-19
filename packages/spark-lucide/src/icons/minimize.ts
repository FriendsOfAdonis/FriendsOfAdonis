import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M8 3v3a2 2 0 0 1-2 2H3', key: 'hohbtr' }],
  ['path', { d: 'M21 8h-3a2 2 0 0 1-2-2V3', key: '5jw1f3' }],
  ['path', { d: 'M3 16h3a2 2 0 0 1 2 2v3', key: '198tvr' }],
  ['path', { d: 'M16 21v-3a2 2 0 0 1 2-2h3', key: 'ph8mxp' }],
]

/**
 * @component @name Minimize
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOCAzdjNhMiAyIDAgMCAxLTIgMkgzIiAvPgogIDxwYXRoIGQ9Ik0yMSA4aC0zYTIgMiAwIDAgMS0yLTJWMyIgLz4KICA8cGF0aCBkPSJNMyAxNmgzYTIgMiAwIDAgMSAyIDJ2MyIgLz4KICA8cGF0aCBkPSJNMTYgMjF2LTNhMiAyIDAgMCAxIDItMmgzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/minimize
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Minimize = createLucideIcon('minimize', __iconNode)

export default Minimize
