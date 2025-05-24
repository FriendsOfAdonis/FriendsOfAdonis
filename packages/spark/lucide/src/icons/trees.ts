import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z', key: '1l6gj6' }],
  ['path', { d: 'M7 16v6', key: '1a82de' }],
  ['path', { d: 'M13 19v3', key: '13sx9i' }],
  [
    'path',
    {
      d: 'M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5',
      key: '1sj9kv',
    },
  ],
]

/**
 * @component @name Trees
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTB2LjJBMyAzIDAgMCAxIDguOSAxNkg1YTMgMyAwIDAgMS0xLTUuOFYxMGEzIDMgMCAwIDEgNiAwWiIgLz4KICA8cGF0aCBkPSJNNyAxNnY2IiAvPgogIDxwYXRoIGQ9Ik0xMyAxOXYzIiAvPgogIDxwYXRoIGQ9Ik0xMiAxOWg4LjNhMSAxIDAgMCAwIC43LTEuN0wxOCAxNGguM2ExIDEgMCAwIDAgLjctMS43TDE2IDloLjJhMSAxIDAgMCAwIC44LTEuN0wxMyAzbC0xLjQgMS41IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/trees
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Trees = createLucideIcon('trees', __iconNode)

export default Trees
