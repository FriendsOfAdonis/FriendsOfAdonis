import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M10 12h.01', key: '1kxr2c' }],
  ['path', { d: 'M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14', key: '36qu9e' }],
  ['path', { d: 'M2 20h20', key: 'owomy5' }],
]

/**
 * @component @name DoorClosed
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTJoLjAxIiAvPgogIDxwYXRoIGQ9Ik0xOCAyMFY2YTIgMiAwIDAgMC0yLTJIOGEyIDIgMCAwIDAtMiAydjE0IiAvPgogIDxwYXRoIGQ9Ik0yIDIwaDIwIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/door-closed
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const DoorClosed = createLucideIcon('door-closed', __iconNode)

export default DoorClosed
