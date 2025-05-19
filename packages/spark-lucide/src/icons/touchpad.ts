import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '20', height: '16', x: '2', y: '4', rx: '2', key: '18n3k1' }],
  ['path', { d: 'M2 14h20', key: 'myj16y' }],
  ['path', { d: 'M12 20v-6', key: '1rm09r' }],
]

/**
 * @component @name Touchpad
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTYiIHg9IjIiIHk9IjQiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik0yIDE0aDIwIiAvPgogIDxwYXRoIGQ9Ik0xMiAyMHYtNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/touchpad
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Touchpad = createLucideIcon('touchpad', __iconNode)

export default Touchpad
