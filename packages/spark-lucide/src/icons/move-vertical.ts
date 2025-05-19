import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M12 2v20', key: 't6zp3m' }],
  ['path', { d: 'm8 18 4 4 4-4', key: 'bh5tu3' }],
  ['path', { d: 'm8 6 4-4 4 4', key: 'ybng9g' }],
]

/**
 * @component @name MoveVertical
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMnYyMCIgLz4KICA8cGF0aCBkPSJtOCAxOCA0IDQgNC00IiAvPgogIDxwYXRoIGQ9Im04IDYgNC00IDQgNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/move-vertical
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const MoveVertical = createLucideIcon('move-vertical', __iconNode)

export default MoveVertical
