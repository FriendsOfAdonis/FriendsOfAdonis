import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M7.9 20A9 9 0 1 0 4 16.1L2 22Z', key: 'vv11sd' }],
  [
    'path',
    {
      d: 'M15.8 9.2a2.5 2.5 0 0 0-3.5 0l-.3.4-.35-.3a2.42 2.42 0 1 0-3.2 3.6l3.6 3.5 3.6-3.5c1.2-1.2 1.1-2.7.2-3.7',
      key: '43lnbm',
    },
  ],
]

/**
 * @component @name MessageCircleHeart
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNy45IDIwQTkgOSAwIDEgMCA0IDE2LjFMMiAyMloiIC8+CiAgPHBhdGggZD0iTTE1LjggOS4yYTIuNSAyLjUgMCAwIDAtMy41IDBsLS4zLjQtLjM1LS4zYTIuNDIgMi40MiAwIDEgMC0zLjIgMy42bDMuNiAzLjUgMy42LTMuNWMxLjItMS4yIDEuMS0yLjcuMi0zLjciIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/message-circle-heart
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const MessageCircleHeart = createLucideIcon('message-circle-heart', __iconNode)

export default MessageCircleHeart
