import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14',
      key: 'e7tb2h',
    },
  ],
  ['path', { d: 'm7.5 4.27 9 5.15', key: '1c824w' }],
  ['polyline', { points: '3.29 7 12 12 20.71 7', key: 'ousv84' }],
  ['line', { x1: '12', x2: '12', y1: '22', y2: '12', key: 'a4e8g8' }],
  ['circle', { cx: '18.5', cy: '15.5', r: '2.5', key: 'b5zd12' }],
  ['path', { d: 'M20.27 17.27 22 19', key: '1l4muz' }],
]

/**
 * @component @name PackageSearch
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgMTBWOGEyIDIgMCAwIDAtMS0xLjczbC03LTRhMiAyIDAgMCAwLTIgMGwtNyA0QTIgMiAwIDAgMCAzIDh2OGEyIDIgMCAwIDAgMSAxLjczbDcgNGEyIDIgMCAwIDAgMiAwbDItMS4xNCIgLz4KICA8cGF0aCBkPSJtNy41IDQuMjcgOSA1LjE1IiAvPgogIDxwb2x5bGluZSBwb2ludHM9IjMuMjkgNyAxMiAxMiAyMC43MSA3IiAvPgogIDxsaW5lIHgxPSIxMiIgeDI9IjEyIiB5MT0iMjIiIHkyPSIxMiIgLz4KICA8Y2lyY2xlIGN4PSIxOC41IiBjeT0iMTUuNSIgcj0iMi41IiAvPgogIDxwYXRoIGQ9Ik0yMC4yNyAxNy4yNyAyMiAxOSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/package-search
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const PackageSearch = createLucideIcon('package-search', __iconNode)

export default PackageSearch
