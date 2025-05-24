import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M16.4 13.7A6.5 6.5 0 1 0 6.28 6.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3',
      key: 'cisjcv',
    },
  ],
  [
    'path',
    {
      d: 'm18.5 6 2.19 4.5a6.48 6.48 0 0 1-2.29 7.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5',
      key: '5byaag',
    },
  ],
  ['circle', { cx: '12.5', cy: '8.5', r: '2.5', key: '9738u8' }],
]

/**
 * @component @name Beef
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYuNCAxMy43QTYuNSA2LjUgMCAxIDAgNi4yOCA2LjZjLTEuMSAzLjEzLS43OCAzLjktMy4xOCA2LjA4QTMgMyAwIDAgMCA1IDE4YzQgMCA4LjQtMS44IDExLjQtNC4zIiAvPgogIDxwYXRoIGQ9Im0xOC41IDYgMi4xOSA0LjVhNi40OCA2LjQ4IDAgMCAxLTIuMjkgNy4yQzE1LjQgMjAuMiAxMSAyMiA3IDIyYTMgMyAwIDAgMS0yLjY4LTEuNjZMMi40IDE2LjUiIC8+CiAgPGNpcmNsZSBjeD0iMTIuNSIgY3k9IjguNSIgcj0iMi41IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/beef
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Beef = createLucideIcon('beef', __iconNode)

export default Beef
