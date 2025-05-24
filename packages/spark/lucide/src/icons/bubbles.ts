import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M7.2 14.8a2 2 0 0 1 2 2', key: '1tw9gg' }],
  ['circle', { cx: '18.5', cy: '8.5', r: '3.5', key: '1wadoa' }],
  ['circle', { cx: '7.5', cy: '16.5', r: '5.5', key: '6mdt3g' }],
  ['circle', { cx: '7.5', cy: '4.5', r: '2.5', key: '637s54' }],
]

/**
 * @component @name Bubbles
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNy4yIDE0LjhhMiAyIDAgMCAxIDIgMiIgLz4KICA8Y2lyY2xlIGN4PSIxOC41IiBjeT0iOC41IiByPSIzLjUiIC8+CiAgPGNpcmNsZSBjeD0iNy41IiBjeT0iMTYuNSIgcj0iNS41IiAvPgogIDxjaXJjbGUgY3g9IjcuNSIgY3k9IjQuNSIgcj0iMi41IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/bubbles
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Bubbles = createLucideIcon('bubbles', __iconNode)

export default Bubbles
