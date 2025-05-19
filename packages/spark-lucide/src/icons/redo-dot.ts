import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '12', cy: '17', r: '1', key: '1ixnty' }],
  ['path', { d: 'M21 7v6h-6', key: '3ptur4' }],
  ['path', { d: 'M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7', key: '1kgawr' }],
]

/**
 * @component @name RedoDot
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjE3IiByPSIxIiAvPgogIDxwYXRoIGQ9Ik0yMSA3djZoLTYiIC8+CiAgPHBhdGggZD0iTTMgMTdhOSA5IDAgMCAxIDktOSA5IDkgMCAwIDEgNiAyLjNsMyAyLjciIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/redo-dot
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const RedoDot = createLucideIcon('redo-dot', __iconNode)

export default RedoDot
