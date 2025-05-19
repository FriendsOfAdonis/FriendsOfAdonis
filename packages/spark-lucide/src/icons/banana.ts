import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M4 13c3.5-2 8-2 10 2a5.5 5.5 0 0 1 8 5', key: '1cscit' }],
  [
    'path',
    {
      d: 'M5.15 17.89c5.52-1.52 8.65-6.89 7-12C11.55 4 11.5 2 13 2c3.22 0 5 5.5 5 8 0 6.5-4.2 12-10.49 12C5.11 22 2 22 2 20c0-1.5 1.14-1.55 3.15-2.11Z',
      key: '1y1nbv',
    },
  ],
]

/**
 * @component @name Banana
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAxM2MzLjUtMiA4LTIgMTAgMmE1LjUgNS41IDAgMCAxIDggNSIgLz4KICA8cGF0aCBkPSJNNS4xNSAxNy44OWM1LjUyLTEuNTIgOC42NS02Ljg5IDctMTJDMTEuNTUgNCAxMS41IDIgMTMgMmMzLjIyIDAgNSA1LjUgNSA4IDAgNi41LTQuMiAxMi0xMC40OSAxMkM1LjExIDIyIDIgMjIgMiAyMGMwLTEuNSAxLjE0LTEuNTUgMy4xNS0yLjExWiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/banana
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Banana = createLucideIcon('banana', __iconNode)

export default Banana
