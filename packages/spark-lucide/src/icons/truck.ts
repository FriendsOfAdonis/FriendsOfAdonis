import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2', key: 'wrbu53' }],
  ['path', { d: 'M15 18H9', key: '1lyqi6' }],
  [
    'path',
    {
      d: 'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14',
      key: 'lysw3i',
    },
  ],
  ['circle', { cx: '17', cy: '18', r: '2', key: '332jqn' }],
  ['circle', { cx: '7', cy: '18', r: '2', key: '19iecd' }],
]

/**
 * @component @name Truck
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTQgMThWNmEyIDIgMCAwIDAtMi0ySDRhMiAyIDAgMCAwLTIgMnYxMWExIDEgMCAwIDAgMSAxaDIiIC8+CiAgPHBhdGggZD0iTTE1IDE4SDkiIC8+CiAgPHBhdGggZD0iTTE5IDE4aDJhMSAxIDAgMCAwIDEtMXYtMy42NWExIDEgMCAwIDAtLjIyLS42MjRsLTMuNDgtNC4zNUExIDEgMCAwIDAgMTcuNTIgOEgxNCIgLz4KICA8Y2lyY2xlIGN4PSIxNyIgY3k9IjE4IiByPSIyIiAvPgogIDxjaXJjbGUgY3g9IjciIGN5PSIxOCIgcj0iMiIgLz4KPC9zdmc+) - https://lucide.dev/icons/truck
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Truck = createLucideIcon('truck', __iconNode)

export default Truck
