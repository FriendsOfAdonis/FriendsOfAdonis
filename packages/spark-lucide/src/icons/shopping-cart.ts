import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '8', cy: '21', r: '1', key: 'jimo8o' }],
  ['circle', { cx: '19', cy: '21', r: '1', key: '13723u' }],
  [
    'path',
    {
      d: 'M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12',
      key: '9zh506',
    },
  ],
]

/**
 * @component @name ShoppingCart
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSI4IiBjeT0iMjEiIHI9IjEiIC8+CiAgPGNpcmNsZSBjeD0iMTkiIGN5PSIyMSIgcj0iMSIgLz4KICA8cGF0aCBkPSJNMi4wNSAyLjA1aDJsMi42NiAxMi40MmEyIDIgMCAwIDAgMiAxLjU4aDkuNzhhMiAyIDAgMCAwIDEuOTUtMS41N2wxLjY1LTcuNDNINS4xMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/shopping-cart
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const ShoppingCart = createLucideIcon('shopping-cart', __iconNode)

export default ShoppingCart
