import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M21.54 15H17a2 2 0 0 0-2 2v4.54', key: '1djwo0' }],
  [
    'path',
    {
      d: 'M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17',
      key: '1tzkfa',
    },
  ],
  ['path', { d: 'M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05', key: '14pb5j' }],
  ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
]

/**
 * @component @name Earth
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEuNTQgMTVIMTdhMiAyIDAgMCAwLTIgMnY0LjU0IiAvPgogIDxwYXRoIGQ9Ik03IDMuMzRWNWEzIDMgMCAwIDAgMyAzYTIgMiAwIDAgMSAyIDJjMCAxLjEuOSAyIDIgMmEyIDIgMCAwIDAgMi0yYzAtMS4xLjktMiAyLTJoMy4xNyIgLz4KICA8cGF0aCBkPSJNMTEgMjEuOTVWMThhMiAyIDAgMCAwLTItMmEyIDIgMCAwIDEtMi0ydi0xYTIgMiAwIDAgMC0yLTJIMi4wNSIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/earth
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Earth = createLucideIcon('earth', __iconNode)

export default Earth
