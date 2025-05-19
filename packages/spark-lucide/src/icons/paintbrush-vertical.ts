import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M10 2v2', key: '7u0qdc' }],
  ['path', { d: 'M14 2v4', key: 'qmzblu' }],
  ['path', { d: 'M17 2a1 1 0 0 1 1 1v9H6V3a1 1 0 0 1 1-1z', key: 'ycvu00' }],
  [
    'path',
    {
      d: 'M6 12a1 1 0 0 0-1 1v1a2 2 0 0 0 2 2h2a1 1 0 0 1 1 1v2.9a2 2 0 1 0 4 0V17a1 1 0 0 1 1-1h2a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1',
      key: 'iw4wnp',
    },
  ],
]

/**
 * @component @name PaintbrushVertical
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMnYyIiAvPgogIDxwYXRoIGQ9Ik0xNCAydjQiIC8+CiAgPHBhdGggZD0iTTE3IDJhMSAxIDAgMCAxIDEgMXY5SDZWM2ExIDEgMCAwIDEgMS0xeiIgLz4KICA8cGF0aCBkPSJNNiAxMmExIDEgMCAwIDAtMSAxdjFhMiAyIDAgMCAwIDIgMmgyYTEgMSAwIDAgMSAxIDF2Mi45YTIgMiAwIDEgMCA0IDBWMTdhMSAxIDAgMCAxIDEtMWgyYTIgMiAwIDAgMCAyLTJ2LTFhMSAxIDAgMCAwLTEtMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/paintbrush-vertical
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const PaintbrushVertical = createLucideIcon('paintbrush-vertical', __iconNode)

export default PaintbrushVertical
