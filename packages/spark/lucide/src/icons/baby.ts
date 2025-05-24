import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5', key: '1u7htd' }],
  ['path', { d: 'M15 12h.01', key: '1k8ypt' }],
  [
    'path',
    {
      d: 'M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1',
      key: '11xh7x',
    },
  ],
  ['path', { d: 'M9 12h.01', key: '157uk2' }],
]

/**
 * @component @name Baby
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTZjLjUuMyAxLjIuNSAyIC41czEuNS0uMiAyLS41IiAvPgogIDxwYXRoIGQ9Ik0xNSAxMmguMDEiIC8+CiAgPHBhdGggZD0iTTE5LjM4IDYuODEzQTkgOSAwIDAgMSAyMC44IDEwLjJhMiAyIDAgMCAxIDAgMy42IDkgOSAwIDAgMS0xNy42IDAgMiAyIDAgMCAxIDAtMy42QTkgOSAwIDAgMSAxMiAzYzIgMCAzLjUgMS4xIDMuNSAyLjVzLS45IDIuNS0yIDIuNWMtLjggMC0xLjUtLjQtMS41LTEiIC8+CiAgPHBhdGggZD0iTTkgMTJoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/baby
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Baby = createLucideIcon('baby', __iconNode)

export default Baby
