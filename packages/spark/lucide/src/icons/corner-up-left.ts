import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M20 20v-7a4 4 0 0 0-4-4H4', key: '1nkjon' }],
  ['path', { d: 'M9 14 4 9l5-5', key: '102s5s' }],
]

/**
 * @component @name CornerUpLeft
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgMjB2LTdhNCA0IDAgMCAwLTQtNEg0IiAvPgogIDxwYXRoIGQ9Ik05IDE0IDQgOWw1LTUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/corner-up-left
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const CornerUpLeft = createLucideIcon('corner-up-left', __iconNode)

export default CornerUpLeft
