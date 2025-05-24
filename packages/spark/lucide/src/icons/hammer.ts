import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'm15 12-8.373 8.373a1 1 0 1 1-3-3L12 9', key: 'eefl8a' }],
  ['path', { d: 'm18 15 4-4', key: '16gjal' }],
  [
    'path',
    {
      d: 'm21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5',
      key: 'b7pghm',
    },
  ],
]

/**
 * @component @name Hammer
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTUgMTItOC4zNzMgOC4zNzNhMSAxIDAgMSAxLTMtM0wxMiA5IiAvPgogIDxwYXRoIGQ9Im0xOCAxNSA0LTQiIC8+CiAgPHBhdGggZD0ibTIxLjUgMTEuNS0xLjkxNC0xLjkxNEEyIDIgMCAwIDEgMTkgOC4xNzJWN2wtMi4yNi0yLjI2YTYgNiAwIDAgMC00LjIwMi0xLjc1Nkw5IDIuOTZsLjkyLjgyQTYuMTggNi4xOCAwIDAgMSAxMiA4LjRWMTBsMiAyaDEuMTcyYTIgMiAwIDAgMSAxLjQxNC41ODZMMTguNSAxNC41IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/hammer
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Hammer = createLucideIcon('hammer', __iconNode)

export default Hammer
