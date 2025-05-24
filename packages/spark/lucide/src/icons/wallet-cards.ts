import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2', key: 'afitv7' }],
  ['path', { d: 'M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2', key: '4125el' }],
  [
    'path',
    {
      d: 'M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21',
      key: '1dpki6',
    },
  ],
]

/**
 * @component @name WalletCards
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik0zIDlhMiAyIDAgMCAxIDItMmgxNGEyIDIgMCAwIDEgMiAyIiAvPgogIDxwYXRoIGQ9Ik0zIDExaDNjLjggMCAxLjYuMyAyLjEuOWwxLjEuOWMxLjYgMS42IDQuMSAxLjYgNS43IDBsMS4xLS45Yy41LS41IDEuMy0uOSAyLjEtLjlIMjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/wallet-cards
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const WalletCards = createLucideIcon('wallet-cards', __iconNode)

export default WalletCards
