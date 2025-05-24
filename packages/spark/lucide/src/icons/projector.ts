import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M5 7 3 5', key: '1yys58' }],
  ['path', { d: 'M9 6V3', key: '1ptz9u' }],
  ['path', { d: 'm13 7 2-2', key: '1w3vmq' }],
  ['circle', { cx: '9', cy: '13', r: '3', key: '1mma13' }],
  [
    'path',
    {
      d: 'M11.83 12H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.17',
      key: '2frwzc',
    },
  ],
  ['path', { d: 'M16 16h2', key: 'dnq2od' }],
]

/**
 * @component @name Projector
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSA3IDMgNSIgLz4KICA8cGF0aCBkPSJNOSA2VjMiIC8+CiAgPHBhdGggZD0ibTEzIDcgMi0yIiAvPgogIDxjaXJjbGUgY3g9IjkiIGN5PSIxMyIgcj0iMyIgLz4KICA8cGF0aCBkPSJNMTEuODMgMTJIMjBhMiAyIDAgMCAxIDIgMnY0YTIgMiAwIDAgMS0yIDJINGEyIDIgMCAwIDEtMi0ydi00YTIgMiAwIDAgMSAyLTJoMi4xNyIgLz4KICA8cGF0aCBkPSJNMTYgMTZoMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/projector
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Projector = createLucideIcon('projector', __iconNode)

export default Projector
