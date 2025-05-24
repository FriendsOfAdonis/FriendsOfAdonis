import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M18 8a2 2 0 0 0 0-4 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0 0 4',
      key: '10td1f',
    },
  ],
  ['path', { d: 'M10 22 9 8', key: 'yjptiv' }],
  ['path', { d: 'm14 22 1-14', key: '8jwc8b' }],
  [
    'path',
    {
      d: 'M20 8c.5 0 .9.4.8 1l-2.6 12c-.1.5-.7 1-1.2 1H7c-.6 0-1.1-.4-1.2-1L3.2 9c-.1-.6.3-1 .8-1Z',
      key: '1qo33t',
    },
  ],
]

/**
 * @component @name Popcorn
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggOGEyIDIgMCAwIDAgMC00IDIgMiAwIDAgMC00IDAgMiAyIDAgMCAwLTQgMCAyIDIgMCAwIDAtNCAwIDIgMiAwIDAgMCAwIDQiIC8+CiAgPHBhdGggZD0iTTEwIDIyIDkgOCIgLz4KICA8cGF0aCBkPSJtMTQgMjIgMS0xNCIgLz4KICA8cGF0aCBkPSJNMjAgOGMuNSAwIC45LjQuOCAxbC0yLjYgMTJjLS4xLjUtLjcgMS0xLjIgMUg3Yy0uNiAwLTEuMS0uNC0xLjItMUwzLjIgOWMtLjEtLjYuMy0xIC44LTFaIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/popcorn
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Popcorn = createLucideIcon('popcorn', __iconNode)

export default Popcorn
