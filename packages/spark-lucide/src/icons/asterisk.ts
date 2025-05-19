import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M12 6v12', key: '1vza4d' }],
  ['path', { d: 'M17.196 9 6.804 15', key: '1ah31z' }],
  ['path', { d: 'm6.804 9 10.392 6', key: '1b6pxd' }],
]

/**
 * @component @name Asterisk
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgNnYxMiIgLz4KICA8cGF0aCBkPSJNMTcuMTk2IDkgNi44MDQgMTUiIC8+CiAgPHBhdGggZD0ibTYuODA0IDkgMTAuMzkyIDYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/asterisk
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Asterisk = createLucideIcon('asterisk', __iconNode)

export default Asterisk
