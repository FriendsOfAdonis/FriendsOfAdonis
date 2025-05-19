import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M10 21V3h8', key: 'br2l0g' }],
  ['path', { d: 'M6 16h9', key: '2py0wn' }],
  ['path', { d: 'M10 9.5h7', key: '13dmhz' }],
]

/**
 * @component @name SwissFranc
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMjFWM2g4IiAvPgogIDxwYXRoIGQ9Ik02IDE2aDkiIC8+CiAgPHBhdGggZD0iTTEwIDkuNWg3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/swiss-franc
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const SwissFranc = createLucideIcon('swiss-franc', __iconNode)

export default SwissFranc
