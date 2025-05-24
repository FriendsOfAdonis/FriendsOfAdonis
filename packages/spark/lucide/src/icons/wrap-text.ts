import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'm16 16-2 2 2 2', key: 'kkc6pm' }],
  ['path', { d: 'M3 12h15a3 3 0 1 1 0 6h-4', key: '1cl7v7' }],
  ['path', { d: 'M3 18h7', key: 'sq21v6' }],
  ['path', { d: 'M3 6h18', key: 'd0wm0j' }],
]

/**
 * @component @name WrapText
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTYgMTYtMiAyIDIgMiIgLz4KICA8cGF0aCBkPSJNMyAxMmgxNWEzIDMgMCAxIDEgMCA2aC00IiAvPgogIDxwYXRoIGQ9Ik0zIDE4aDciIC8+CiAgPHBhdGggZD0iTTMgNmgxOCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/wrap-text
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const WrapText = createLucideIcon('wrap-text', __iconNode)

export default WrapText
