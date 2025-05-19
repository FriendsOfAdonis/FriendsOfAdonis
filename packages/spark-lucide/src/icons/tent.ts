import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M3.5 21 14 3', key: '1szst5' }],
  ['path', { d: 'M20.5 21 10 3', key: '1310c3' }],
  ['path', { d: 'M15.5 21 12 15l-3.5 6', key: '1ddtfw' }],
  ['path', { d: 'M2 21h20', key: '1nyx9w' }],
]

/**
 * @component @name Tent
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMy41IDIxIDE0IDMiIC8+CiAgPHBhdGggZD0iTTIwLjUgMjEgMTAgMyIgLz4KICA8cGF0aCBkPSJNMTUuNSAyMSAxMiAxNWwtMy41IDYiIC8+CiAgPHBhdGggZD0iTTIgMjFoMjAiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/tent
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Tent = createLucideIcon('tent', __iconNode)

export default Tent
