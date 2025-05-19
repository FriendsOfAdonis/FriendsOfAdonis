import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M12 4v16', key: '1654pz' }],
  ['path', { d: 'M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2', key: 'e0r10z' }],
  ['path', { d: 'M9 20h6', key: 's66wpe' }],
]

/**
 * @component @name Type
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgNHYxNiIgLz4KICA8cGF0aCBkPSJNNCA3VjVhMSAxIDAgMCAxIDEtMWgxNGExIDEgMCAwIDEgMSAxdjIiIC8+CiAgPHBhdGggZD0iTTkgMjBoNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/type
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Type = createLucideIcon('type', __iconNode)

export default Type
