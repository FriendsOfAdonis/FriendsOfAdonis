import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    { d: 'M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2', key: '1m57jg' },
  ],
  ['path', { d: 'M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14', key: '1l99gc' }],
  ['path', { d: 'M10 20h4', key: 'ni2waw' }],
  ['circle', { cx: '16', cy: '20', r: '2', key: '1vifvg' }],
  ['circle', { cx: '8', cy: '20', r: '2', key: 'ckkr5m' }],
]

/**
 * @component @name Luggage
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNiAyMGEyIDIgMCAwIDEtMi0yVjhhMiAyIDAgMCAxIDItMmgxMmEyIDIgMCAwIDEgMiAydjEwYTIgMiAwIDAgMS0yIDIiIC8+CiAgPHBhdGggZD0iTTggMThWNGEyIDIgMCAwIDEgMi0yaDRhMiAyIDAgMCAxIDIgMnYxNCIgLz4KICA8cGF0aCBkPSJNMTAgMjBoNCIgLz4KICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjIwIiByPSIyIiAvPgogIDxjaXJjbGUgY3g9IjgiIGN5PSIyMCIgcj0iMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/luggage
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Luggage = createLucideIcon('luggage', __iconNode)

export default Luggage
