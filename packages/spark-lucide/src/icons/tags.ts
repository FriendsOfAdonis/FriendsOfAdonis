import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'm15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19', key: '1cbfv1' }],
  [
    'path',
    {
      d: 'M9.586 5.586A2 2 0 0 0 8.172 5H3a1 1 0 0 0-1 1v5.172a2 2 0 0 0 .586 1.414L8.29 18.29a2.426 2.426 0 0 0 3.42 0l3.58-3.58a2.426 2.426 0 0 0 0-3.42z',
      key: '135mg7',
    },
  ],
  ['circle', { cx: '6.5', cy: '9.5', r: '.5', fill: 'currentColor', key: '5pm5xn' }],
]

/**
 * @component @name Tags
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTUgNSA2LjMgNi4zYTIuNCAyLjQgMCAwIDEgMCAzLjRMMTcgMTkiIC8+CiAgPHBhdGggZD0iTTkuNTg2IDUuNTg2QTIgMiAwIDAgMCA4LjE3MiA1SDNhMSAxIDAgMCAwLTEgMXY1LjE3MmEyIDIgMCAwIDAgLjU4NiAxLjQxNEw4LjI5IDE4LjI5YTIuNDI2IDIuNDI2IDAgMCAwIDMuNDIgMGwzLjU4LTMuNThhMi40MjYgMi40MjYgMCAwIDAgMC0zLjQyeiIgLz4KICA8Y2lyY2xlIGN4PSI2LjUiIGN5PSI5LjUiIHI9Ii41IiBmaWxsPSJjdXJyZW50Q29sb3IiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/tags
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Tags = createLucideIcon('tags', __iconNode)

export default Tags
