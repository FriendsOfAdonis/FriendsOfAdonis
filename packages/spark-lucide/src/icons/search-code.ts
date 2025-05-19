import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'm13 13.5 2-2.5-2-2.5', key: '1rvxrh' }],
  ['path', { d: 'm21 21-4.3-4.3', key: '1qie3q' }],
  ['path', { d: 'M9 8.5 7 11l2 2.5', key: '6ffwbx' }],
  ['circle', { cx: '11', cy: '11', r: '8', key: '4ej97u' }],
]

/**
 * @component @name SearchCode
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTMgMTMuNSAyLTIuNS0yLTIuNSIgLz4KICA8cGF0aCBkPSJtMjEgMjEtNC4zLTQuMyIgLz4KICA8cGF0aCBkPSJNOSA4LjUgNyAxMWwyIDIuNSIgLz4KICA8Y2lyY2xlIGN4PSIxMSIgY3k9IjExIiByPSI4IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/search-code
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const SearchCode = createLucideIcon('search-code', __iconNode)

export default SearchCode
