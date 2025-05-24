import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2', key: 'afitv7' }],
  ['path', { d: 'M12 9v6', key: '199k2o' }],
  ['path', { d: 'M16 15v6', key: '8rj2es' }],
  ['path', { d: 'M16 3v6', key: '1j6rpj' }],
  ['path', { d: 'M3 15h18', key: '5xshup' }],
  ['path', { d: 'M3 9h18', key: '1pudct' }],
  ['path', { d: 'M8 15v6', key: '1stoo3' }],
  ['path', { d: 'M8 3v6', key: 'vlvjmk' }],
]

/**
 * @component @name BrickWall
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik0xMiA5djYiIC8+CiAgPHBhdGggZD0iTTE2IDE1djYiIC8+CiAgPHBhdGggZD0iTTE2IDN2NiIgLz4KICA8cGF0aCBkPSJNMyAxNWgxOCIgLz4KICA8cGF0aCBkPSJNMyA5aDE4IiAvPgogIDxwYXRoIGQ9Ik04IDE1djYiIC8+CiAgPHBhdGggZD0iTTggM3Y2IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/brick-wall
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const BrickWall = createLucideIcon('brick-wall', __iconNode)

export default BrickWall
