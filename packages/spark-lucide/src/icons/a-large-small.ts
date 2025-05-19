import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M21 14h-5', key: '1vh23k' }],
  ['path', { d: 'M16 16v-3.5a2.5 2.5 0 0 1 5 0V16', key: '1wh10o' }],
  ['path', { d: 'M4.5 13h6', key: 'dfilno' }],
  ['path', { d: 'm3 16 4.5-9 4.5 9', key: '2dxa0e' }],
]

/**
 * @component @name ALargeSmall
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgMTRoLTUiIC8+CiAgPHBhdGggZD0iTTE2IDE2di0zLjVhMi41IDIuNSAwIDAgMSA1IDBWMTYiIC8+CiAgPHBhdGggZD0iTTQuNSAxM2g2IiAvPgogIDxwYXRoIGQ9Im0zIDE2IDQuNS05IDQuNSA5IiAvPgo8L3N2Zz4=) - https://lucide.dev/icons/a-large-small
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const ALargeSmall = createLucideIcon('a-large-small', __iconNode)

export default ALargeSmall
