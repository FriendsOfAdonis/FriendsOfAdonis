import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '12', cy: '12', r: '6', key: '1vlfrh' }],
  ['polyline', { points: '12 10 12 12 13 13', key: '19dquz' }],
  [
    'path',
    { d: 'm16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05', key: '18k57s' },
  ],
  ['path', { d: 'm7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05', key: '16ny36' }],
]

/**
 * @component @name Watch
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI2IiAvPgogIDxwb2x5bGluZSBwb2ludHM9IjEyIDEwIDEyIDEyIDEzIDEzIiAvPgogIDxwYXRoIGQ9Im0xNi4xMyA3LjY2LS44MS00LjA1YTIgMiAwIDAgMC0yLTEuNjFoLTIuNjhhMiAyIDAgMCAwLTIgMS42MWwtLjc4IDQuMDUiIC8+CiAgPHBhdGggZD0ibTcuODggMTYuMzYuOCA0YTIgMiAwIDAgMCAyIDEuNjFoMi43MmEyIDIgMCAwIDAgMi0xLjYxbC44MS00LjA1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/watch
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Watch = createLucideIcon('watch', __iconNode)

export default Watch
