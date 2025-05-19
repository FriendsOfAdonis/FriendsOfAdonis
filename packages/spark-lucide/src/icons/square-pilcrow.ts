import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2', key: 'afitv7' }],
  ['path', { d: 'M12 12H9.5a2.5 2.5 0 0 1 0-5H17', key: '1l9586' }],
  ['path', { d: 'M12 7v10', key: 'jspqdw' }],
  ['path', { d: 'M16 7v10', key: 'lavkr4' }],
]

/**
 * @component @name SquarePilcrow
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik0xMiAxMkg5LjVhMi41IDIuNSAwIDAgMSAwLTVIMTciIC8+CiAgPHBhdGggZD0iTTEyIDd2MTAiIC8+CiAgPHBhdGggZD0iTTE2IDd2MTAiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/square-pilcrow
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const SquarePilcrow = createLucideIcon('square-pilcrow', __iconNode)

export default SquarePilcrow
