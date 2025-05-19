import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M4 12h8', key: '17cfdx' }],
  ['path', { d: 'M4 18V6', key: '1rz3zl' }],
  ['path', { d: 'M12 18V6', key: 'zqpxq5' }],
  ['path', { d: 'm17 12 3-2v8', key: '1hhhft' }],
]

/**
 * @component @name Heading1
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAxMmg4IiAvPgogIDxwYXRoIGQ9Ik00IDE4VjYiIC8+CiAgPHBhdGggZD0iTTEyIDE4VjYiIC8+CiAgPHBhdGggZD0ibTE3IDEyIDMtMnY4IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/heading-1
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Heading1 = createLucideIcon('heading-1', __iconNode)

export default Heading1
