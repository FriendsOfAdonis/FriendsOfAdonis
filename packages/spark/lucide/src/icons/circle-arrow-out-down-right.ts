import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M12 22a10 10 0 1 1 10-10', key: '130bv5' }],
  ['path', { d: 'M22 22 12 12', key: '131aw7' }],
  ['path', { d: 'M22 16v6h-6', key: '1gvm70' }],
]

/**
 * @component @name CircleArrowOutDownRight
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMjJhMTAgMTAgMCAxIDEgMTAtMTAiIC8+CiAgPHBhdGggZD0iTTIyIDIyIDEyIDEyIiAvPgogIDxwYXRoIGQ9Ik0yMiAxNnY2aC02IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/circle-arrow-out-down-right
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const CircleArrowOutDownRight = createLucideIcon('circle-arrow-out-down-right', __iconNode)

export default CircleArrowOutDownRight
