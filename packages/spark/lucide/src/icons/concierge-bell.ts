import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    { d: 'M3 20a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1Z', key: '1pvr1r' },
  ],
  ['path', { d: 'M20 16a8 8 0 1 0-16 0', key: '1pa543' }],
  ['path', { d: 'M12 4v4', key: '1bq03y' }],
  ['path', { d: 'M10 4h4', key: '1xpv9s' }],
]

/**
 * @component @name ConciergeBell
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAyMGExIDEgMCAwIDEtMS0xdi0xYTIgMiAwIDAgMSAyLTJoMTZhMiAyIDAgMCAxIDIgMnYxYTEgMSAwIDAgMS0xIDFaIiAvPgogIDxwYXRoIGQ9Ik0yMCAxNmE4IDggMCAxIDAtMTYgMCIgLz4KICA8cGF0aCBkPSJNMTIgNHY0IiAvPgogIDxwYXRoIGQ9Ik0xMCA0aDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/concierge-bell
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const ConciergeBell = createLucideIcon('concierge-bell', __iconNode)

export default ConciergeBell
