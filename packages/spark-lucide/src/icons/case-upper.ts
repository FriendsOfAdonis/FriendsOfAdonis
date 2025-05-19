import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'm3 15 4-8 4 8', key: '1vwr6u' }],
  ['path', { d: 'M4 13h6', key: '1r9ots' }],
  ['path', { d: 'M15 11h4.5a2 2 0 0 1 0 4H15V7h4a2 2 0 0 1 0 4', key: '1sqfas' }],
]

/**
 * @component @name CaseUpper
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMyAxNSA0LTggNCA4IiAvPgogIDxwYXRoIGQ9Ik00IDEzaDYiIC8+CiAgPHBhdGggZD0iTTE1IDExaDQuNWEyIDIgMCAwIDEgMCA0SDE1VjdoNGEyIDIgMCAwIDEgMCA0IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/case-upper
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const CaseUpper = createLucideIcon('case-upper', __iconNode)

export default CaseUpper
