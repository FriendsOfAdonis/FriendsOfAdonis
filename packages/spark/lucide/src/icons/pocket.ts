import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z',
      key: '1mz881',
    },
  ],
  ['polyline', { points: '8 10 12 14 16 10', key: 'w4mbv5' }],
]

/**
 * @component @name Pocket
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAzaDE2YTIgMiAwIDAgMSAyIDJ2NmExMCAxMCAwIDAgMS0xMCAxMEExMCAxMCAwIDAgMSAyIDExVjVhMiAyIDAgMCAxIDItMnoiIC8+CiAgPHBvbHlsaW5lIHBvaW50cz0iOCAxMCAxMiAxNCAxNiAxMCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/pocket
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 * @deprecated Brand icons have been deprecated and are due to be removed, please refer to https://github.com/lucide-icons/lucide/issues/670. We recommend using https://simpleicons.org/?q=pocket instead. This icon will be removed in v1.0
 */
const Pocket = createLucideIcon('pocket', __iconNode)

export default Pocket
