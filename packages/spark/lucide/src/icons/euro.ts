import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M4 10h12', key: '1y6xl8' }],
  ['path', { d: 'M4 14h9', key: '1loblj' }],
  [
    'path',
    {
      d: 'M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2',
      key: '1j6lzo',
    },
  ],
]

/**
 * @component @name Euro
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAxMGgxMiIgLz4KICA8cGF0aCBkPSJNNCAxNGg5IiAvPgogIDxwYXRoIGQ9Ik0xOSA2YTcuNyA3LjcgMCAwIDAtNS4yLTJBNy45IDcuOSAwIDAgMCA2IDEyYzAgNC40IDMuNSA4IDcuOCA4IDIgMCAzLjgtLjggNS4yLTIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/euro
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Euro = createLucideIcon('euro', __iconNode)

export default Euro
