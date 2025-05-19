import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M12 7v4', key: 'xawao1' }],
  ['path', { d: 'M7.998 9.003a5 5 0 1 0 8-.005', key: '1pek45' }],
  ['rect', { x: '3', y: '3', width: '18', height: '18', rx: '2', key: 'h1oib' }],
]

/**
 * @component @name SquarePower
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgN3Y0IiAvPgogIDxwYXRoIGQ9Ik03Ljk5OCA5LjAwM2E1IDUgMCAxIDAgOC0uMDA1IiAvPgogIDxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/square-power
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const SquarePower = createLucideIcon('square-power', __iconNode)

export default SquarePower
