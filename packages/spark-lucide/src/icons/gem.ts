import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M6 3h12l4 6-10 13L2 9Z', key: '1pcd5k' }],
  ['path', { d: 'M11 3 8 9l4 13 4-13-3-6', key: '1fcu3u' }],
  ['path', { d: 'M2 9h20', key: '16fsjt' }],
]

/**
 * @component @name Gem
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNiAzaDEybDQgNi0xMCAxM0wyIDlaIiAvPgogIDxwYXRoIGQ9Ik0xMSAzIDggOWw0IDEzIDQtMTMtMy02IiAvPgogIDxwYXRoIGQ9Ik0yIDloMjAiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/gem
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Gem = createLucideIcon('gem', __iconNode)

export default Gem
