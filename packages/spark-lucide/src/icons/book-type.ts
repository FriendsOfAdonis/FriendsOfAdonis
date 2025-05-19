import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M10 13h4', key: 'ytezjc' }],
  ['path', { d: 'M12 6v7', key: '1f6ttz' }],
  ['path', { d: 'M16 8V6H8v2', key: 'x8j6u4' }],
  [
    'path',
    {
      d: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20',
      key: 'k3hazp',
    },
  ],
]

/**
 * @component @name BookType
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTNoNCIgLz4KICA8cGF0aCBkPSJNMTIgNnY3IiAvPgogIDxwYXRoIGQ9Ik0xNiA4VjZIOHYyIiAvPgogIDxwYXRoIGQ9Ik00IDE5LjV2LTE1QTIuNSAyLjUgMCAwIDEgNi41IDJIMTlhMSAxIDAgMCAxIDEgMXYxOGExIDEgMCAwIDEtMSAxSDYuNWExIDEgMCAwIDEgMC01SDIwIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/book-type
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const BookType = createLucideIcon('book-type', __iconNode)

export default BookType
