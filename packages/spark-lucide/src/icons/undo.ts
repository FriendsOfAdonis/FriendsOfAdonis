import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M3 7v6h6', key: '1v2h90' }],
  ['path', { d: 'M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13', key: '1r6uu6' }],
]

/**
 * @component @name Undo
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyA3djZoNiIgLz4KICA8cGF0aCBkPSJNMjEgMTdhOSA5IDAgMCAwLTktOSA5IDkgMCAwIDAtNiAyLjNMMyAxMyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/undo
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Undo = createLucideIcon('undo', __iconNode)

export default Undo
