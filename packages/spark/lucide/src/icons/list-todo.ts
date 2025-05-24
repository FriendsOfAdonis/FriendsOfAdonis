import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { x: '3', y: '5', width: '6', height: '6', rx: '1', key: '1defrl' }],
  ['path', { d: 'm3 17 2 2 4-4', key: '1jhpwq' }],
  ['path', { d: 'M13 6h8', key: '15sg57' }],
  ['path', { d: 'M13 12h8', key: 'h98zly' }],
  ['path', { d: 'M13 18h8', key: 'oe0vm4' }],
]

/**
 * @component @name ListTodo
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB4PSIzIiB5PSI1IiB3aWR0aD0iNiIgaGVpZ2h0PSI2IiByeD0iMSIgLz4KICA8cGF0aCBkPSJtMyAxNyAyIDIgNC00IiAvPgogIDxwYXRoIGQ9Ik0xMyA2aDgiIC8+CiAgPHBhdGggZD0iTTEzIDEyaDgiIC8+CiAgPHBhdGggZD0iTTEzIDE4aDgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/list-todo
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const ListTodo = createLucideIcon('list-todo', __iconNode)

export default ListTodo
