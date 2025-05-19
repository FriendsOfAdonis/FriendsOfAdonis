import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M8 6v6', key: '18i7km' }],
  ['path', { d: 'M15 6v6', key: '1sg6z9' }],
  ['path', { d: 'M2 12h19.6', key: 'de5uta' }],
  [
    'path',
    {
      d: 'M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3',
      key: '1wwztk',
    },
  ],
  ['circle', { cx: '7', cy: '18', r: '2', key: '19iecd' }],
  ['path', { d: 'M9 18h5', key: 'lrx6i' }],
  ['circle', { cx: '16', cy: '18', r: '2', key: '1v4tcr' }],
]

/**
 * @component @name Bus
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOCA2djYiIC8+CiAgPHBhdGggZD0iTTE1IDZ2NiIgLz4KICA8cGF0aCBkPSJNMiAxMmgxOS42IiAvPgogIDxwYXRoIGQ9Ik0xOCAxOGgzcy41LTEuNy44LTIuOGMuMS0uNC4yLS44LjItMS4yIDAtLjQtLjEtLjgtLjItMS4ybC0xLjQtNUMyMC4xIDYuOCAxOS4xIDYgMTggNkg0YTIgMiAwIDAgMC0yIDJ2MTBoMyIgLz4KICA8Y2lyY2xlIGN4PSI3IiBjeT0iMTgiIHI9IjIiIC8+CiAgPHBhdGggZD0iTTkgMThoNSIgLz4KICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjE4IiByPSIyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/bus
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Bus = createLucideIcon('bus', __iconNode)

export default Bus
