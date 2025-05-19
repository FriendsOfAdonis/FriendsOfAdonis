import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M5 15h14', key: 'm0yey3' }],
  ['path', { d: 'M5 9h14', key: '7tsvo6' }],
  ['path', { d: 'm14 20-5-5 6-6-5-5', key: '1jo42i' }],
]

/**
 * @component @name RailSymbol
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAxNWgxNCIgLz4KICA8cGF0aCBkPSJNNSA5aDE0IiAvPgogIDxwYXRoIGQ9Im0xNCAyMC01LTUgNi02LTUtNSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/rail-symbol
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const RailSymbol = createLucideIcon('rail-symbol', __iconNode)

export default RailSymbol
