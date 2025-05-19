import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { x: '5', y: '2', width: '14', height: '20', rx: '7', key: '11ol66' }],
  ['path', { d: 'M12 6v4', key: '16clxf' }],
]

/**
 * @component @name Mouse
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB4PSI1IiB5PSIyIiB3aWR0aD0iMTQiIGhlaWdodD0iMjAiIHJ4PSI3IiAvPgogIDxwYXRoIGQ9Ik0xMiA2djQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/mouse
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Mouse = createLucideIcon('mouse', __iconNode)

export default Mouse
