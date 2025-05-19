import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'm10 18 3-3-3-3', key: '18f6ys' }],
  ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4', key: 'tnqrlb' }],
  [
    'path',
    {
      d: 'M4 11V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7',
      key: '50q2rw',
    },
  ],
]

/**
 * @component @name FileSymlink
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTAgMTggMy0zLTMtMyIgLz4KICA8cGF0aCBkPSJNMTQgMnY0YTIgMiAwIDAgMCAyIDJoNCIgLz4KICA8cGF0aCBkPSJNNCAxMVY0YTIgMiAwIDAgMSAyLTJoOWw1IDV2MTNhMiAyIDAgMCAxLTIgMkg2YTIgMiAwIDAgMS0yLTJ2LTNhMiAyIDAgMCAxIDItMmg3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/file-symlink
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const FileSymlink = createLucideIcon('file-symlink', __iconNode)

export default FileSymlink
