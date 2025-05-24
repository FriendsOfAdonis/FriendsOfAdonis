import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M12 6v4', key: '16clxf' }],
  ['path', { d: 'M14 14h-4', key: 'esezmu' }],
  ['path', { d: 'M14 18h-4', key: '16mqa2' }],
  ['path', { d: 'M14 8h-4', key: 'z8ypaz' }],
  [
    'path',
    {
      d: 'M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2',
      key: 'b1k337',
    },
  ],
  ['path', { d: 'M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18', key: '16g51d' }],
]

/**
 * @component @name Hospital
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgNnY0IiAvPgogIDxwYXRoIGQ9Ik0xNCAxNGgtNCIgLz4KICA8cGF0aCBkPSJNMTQgMThoLTQiIC8+CiAgPHBhdGggZD0iTTE0IDhoLTQiIC8+CiAgPHBhdGggZD0iTTE4IDEyaDJhMiAyIDAgMCAxIDIgMnY2YTIgMiAwIDAgMS0yIDJINGEyIDIgMCAwIDEtMi0ydi05YTIgMiAwIDAgMSAyLTJoMiIgLz4KICA8cGF0aCBkPSJNMTggMjJWNGEyIDIgMCAwIDAtMi0ySDhhMiAyIDAgMCAwLTIgMnYxOCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/hospital
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Hospital = createLucideIcon('hospital', __iconNode)

export default Hospital
