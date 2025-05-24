import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M17.5 12c0 4.4-3.6 8-8 8A4.5 4.5 0 0 1 5 15.5c0-6 8-4 8-8.5a3 3 0 1 0-6 0c0 3 2.5 8.5 12 13',
      key: '1o9ehi',
    },
  ],
  ['path', { d: 'M16 12h3', key: '4uvgyw' }],
]

/**
 * @component @name Ampersand
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTcuNSAxMmMwIDQuNC0zLjYgOC04IDhBNC41IDQuNSAwIDAgMSA1IDE1LjVjMC02IDgtNCA4LTguNWEzIDMgMCAxIDAtNiAwYzAgMyAyLjUgOC41IDEyIDEzIiAvPgogIDxwYXRoIGQ9Ik0xNiAxMmgzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/ampersand
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Ampersand = createLucideIcon('ampersand', __iconNode)

export default Ampersand
