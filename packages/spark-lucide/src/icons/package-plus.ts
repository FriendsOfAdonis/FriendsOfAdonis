import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M16 16h6', key: '100bgy' }],
  ['path', { d: 'M19 13v6', key: '85cyf1' }],
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
]

/**
 * @component @name PackagePlus
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgMTZoNiIgLz4KICA8cGF0aCBkPSJNMTkgMTN2NiIgLz4KICA8cGF0aCBkPSJNMjEgMTBWOGEyIDIgMCAwIDAtMS0xLjczbC03LTRhMiAyIDAgMCAwLTIgMGwtNyA0QTIgMiAwIDAgMCAzIDh2OGEyIDIgMCAwIDAgMSAxLjczbDcgNGEyIDIgMCAwIDAgMiAwbDItMS4xNCIgLz4KICA8cGF0aCBkPSJtNy41IDQuMjcgOSA1LjE1IiAvPgogIDxwb2x5bGluZSBwb2ludHM9IjMuMjkgNyAxMiAxMiAyMC43MSA3IiAvPgogIDxsaW5lIHgxPSIxMiIgeDI9IjEyIiB5MT0iMjIiIHkyPSIxMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/package-plus
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const PackagePlus = createLucideIcon('package-plus', __iconNode)

export default PackagePlus
