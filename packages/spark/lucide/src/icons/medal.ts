import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15',
      key: '143lza',
    },
  ],
  ['path', { d: 'M11 12 5.12 2.2', key: 'qhuxz6' }],
  ['path', { d: 'm13 12 5.88-9.8', key: 'hbye0f' }],
  ['path', { d: 'M8 7h8', key: 'i86dvs' }],
  ['circle', { cx: '12', cy: '17', r: '5', key: 'qbz8iq' }],
  ['path', { d: 'M12 18v-2h-.5', key: 'fawc4q' }],
]

/**
 * @component @name Medal
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNy4yMSAxNSAyLjY2IDcuMTRhMiAyIDAgMCAxIC4xMy0yLjJMNC40IDIuOEEyIDIgMCAwIDEgNiAyaDEyYTIgMiAwIDAgMSAxLjYuOGwxLjYgMi4xNGEyIDIgMCAwIDEgLjE0IDIuMkwxNi43OSAxNSIgLz4KICA8cGF0aCBkPSJNMTEgMTIgNS4xMiAyLjIiIC8+CiAgPHBhdGggZD0ibTEzIDEyIDUuODgtOS44IiAvPgogIDxwYXRoIGQ9Ik04IDdoOCIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjE3IiByPSI1IiAvPgogIDxwYXRoIGQ9Ik0xMiAxOHYtMmgtLjUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/medal
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Medal = createLucideIcon('medal', __iconNode)

export default Medal
