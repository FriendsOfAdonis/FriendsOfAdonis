import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M18 6V4a2 2 0 1 0-4 0v2', key: '1aquzs' }],
  ['path', { d: 'M20 15v6a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20', key: '1rkj32' }],
  ['path', { d: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H10', key: '18wgow' }],
  ['rect', { x: '12', y: '6', width: '8', height: '5', rx: '1', key: '73l30o' }],
]

/**
 * @component @name BookLock
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggNlY0YTIgMiAwIDEgMC00IDB2MiIgLz4KICA8cGF0aCBkPSJNMjAgMTV2NmExIDEgMCAwIDEtMSAxSDYuNWExIDEgMCAwIDEgMC01SDIwIiAvPgogIDxwYXRoIGQ9Ik00IDE5LjV2LTE1QTIuNSAyLjUgMCAwIDEgNi41IDJIMTAiIC8+CiAgPHJlY3QgeD0iMTIiIHk9IjYiIHdpZHRoPSI4IiBoZWlnaHQ9IjUiIHJ4PSIxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/book-lock
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const BookLock = createLucideIcon('book-lock', __iconNode)

export default BookLock
