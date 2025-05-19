import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M18 6c0 2-2 2-2 4v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4V2h12z',
      key: '1orkel',
    },
  ],
  ['line', { x1: '6', x2: '18', y1: '6', y2: '6', key: '1z11jq' }],
  ['line', { x1: '12', x2: '12', y1: '12', y2: '12', key: '1f4yc1' }],
]

/**
 * @component @name Flashlight
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggNmMwIDItMiAyLTIgNHYxMGEyIDIgMCAwIDEtMiAyaC00YTIgMiAwIDAgMS0yLTJWMTBjMC0yLTItMi0yLTRWMmgxMnoiIC8+CiAgPGxpbmUgeDE9IjYiIHgyPSIxOCIgeTE9IjYiIHkyPSI2IiAvPgogIDxsaW5lIHgxPSIxMiIgeDI9IjEyIiB5MT0iMTIiIHkyPSIxMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/flashlight
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Flashlight = createLucideIcon('flashlight', __iconNode)

export default Flashlight
