import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M16 5a4 3 0 0 0-8 0c0 4 8 3 8 7a4 3 0 0 1-8 0', key: 'vqan6v' }],
  ['path', { d: 'M8 19a4 3 0 0 0 8 0c0-4-8-3-8-7a4 3 0 0 1 8 0', key: 'wdjd8o' }],
]

/**
 * @component @name Section
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgNWE0IDMgMCAwIDAtOCAwYzAgNCA4IDMgOCA3YTQgMyAwIDAgMS04IDAiIC8+CiAgPHBhdGggZD0iTTggMTlhNCAzIDAgMCAwIDggMGMwLTQtOC0zLTgtN2E0IDMgMCAwIDEgOCAwIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/section
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Section = createLucideIcon('section', __iconNode)

export default Section
