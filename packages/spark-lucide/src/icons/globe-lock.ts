import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M15.686 15A14.5 14.5 0 0 1 12 22a14.5 14.5 0 0 1 0-20 10 10 0 1 0 9.542 13',
      key: 'qkt0x6',
    },
  ],
  ['path', { d: 'M2 12h8.5', key: 'ovaggd' }],
  ['path', { d: 'M20 6V4a2 2 0 1 0-4 0v2', key: '1of5e8' }],
  ['rect', { width: '8', height: '5', x: '14', y: '6', rx: '1', key: '1fmf51' }],
]

/**
 * @component @name GlobeLock
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUuNjg2IDE1QTE0LjUgMTQuNSAwIDAgMSAxMiAyMmExNC41IDE0LjUgMCAwIDEgMC0yMCAxMCAxMCAwIDEgMCA5LjU0MiAxMyIgLz4KICA8cGF0aCBkPSJNMiAxMmg4LjUiIC8+CiAgPHBhdGggZD0iTTIwIDZWNGEyIDIgMCAxIDAtNCAwdjIiIC8+CiAgPHJlY3Qgd2lkdGg9IjgiIGhlaWdodD0iNSIgeD0iMTQiIHk9IjYiIHJ4PSIxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/globe-lock
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const GlobeLock = createLucideIcon('globe-lock', __iconNode)

export default GlobeLock
