import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'm2 2 20 20', key: '1ooewy' }],
  ['path', { d: 'M8.35 2.69A10 10 0 0 1 21.3 15.65', key: '1pfsoa' }],
  ['path', { d: 'M19.08 19.08A10 10 0 1 1 4.92 4.92', key: '1ablyi' }],
]

/**
 * @component @name CircleOff
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMiAyIDIwIDIwIiAvPgogIDxwYXRoIGQ9Ik04LjM1IDIuNjlBMTAgMTAgMCAwIDEgMjEuMyAxNS42NSIgLz4KICA8cGF0aCBkPSJNMTkuMDggMTkuMDhBMTAgMTAgMCAxIDEgNC45MiA0LjkyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/circle-off
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const CircleOff = createLucideIcon('circle-off', __iconNode)

export default CircleOff
