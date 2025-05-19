import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z', key: '1404fh' }],
  ['path', { d: 'M21 14 10 2 3 14h18Z', key: '1nzg7v' }],
  ['path', { d: 'M10 2v16', key: '1labyt' }],
]

/**
 * @component @name Sailboat
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjIgMThIMmE0IDQgMCAwIDAgNCA0aDEyYTQgNCAwIDAgMCA0LTRaIiAvPgogIDxwYXRoIGQ9Ik0yMSAxNCAxMCAyIDMgMTRoMThaIiAvPgogIDxwYXRoIGQ9Ik0xMCAydjE2IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/sailboat
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Sailboat = createLucideIcon('sailboat', __iconNode)

export default Sailboat
