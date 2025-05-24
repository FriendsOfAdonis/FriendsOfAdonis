import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '12', cy: '4', r: '2', key: 'muu5ef' }],
  [
    'path',
    {
      d: 'M10.2 3.2C5.5 4 2 8.1 2 13a2 2 0 0 0 4 0v-1a2 2 0 0 1 4 0v4a2 2 0 0 0 4 0v-4a2 2 0 0 1 4 0v1a2 2 0 0 0 4 0c0-4.9-3.5-9-8.2-9.8',
      key: 'lfo06j',
    },
  ],
  ['path', { d: 'M3.2 14.8a9 9 0 0 0 17.6 0', key: '12xarc' }],
]

/**
 * @component @name Dessert
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjQiIHI9IjIiIC8+CiAgPHBhdGggZD0iTTEwLjIgMy4yQzUuNSA0IDIgOC4xIDIgMTNhMiAyIDAgMCAwIDQgMHYtMWEyIDIgMCAwIDEgNCAwdjRhMiAyIDAgMCAwIDQgMHYtNGEyIDIgMCAwIDEgNCAwdjFhMiAyIDAgMCAwIDQgMGMwLTQuOS0zLjUtOS04LjItOS44IiAvPgogIDxwYXRoIGQ9Ik0zLjIgMTQuOGE5IDkgMCAwIDAgMTcuNiAwIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/dessert
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Dessert = createLucideIcon('dessert', __iconNode)

export default Dessert
