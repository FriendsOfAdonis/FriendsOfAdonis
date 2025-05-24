import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M20 4L9 15', key: '1qkx8z' }],
  ['path', { d: 'M21 19L3 19', key: '100sma' }],
  ['path', { d: 'M9 15L4 10', key: '9zxff7' }],
]

/**
 * @component @name CheckLine
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgNEw5IDE1IiAvPgogIDxwYXRoIGQ9Ik0yMSAxOUwzIDE5IiAvPgogIDxwYXRoIGQ9Ik05IDE1TDQgMTAiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/check-line
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const CheckLine = createLucideIcon('check-line', __iconNode)

export default CheckLine
