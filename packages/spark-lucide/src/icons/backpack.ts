import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    { d: 'M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z', key: '1ol0lm' },
  ],
  ['path', { d: 'M8 10h8', key: 'c7uz4u' }],
  ['path', { d: 'M8 18h8', key: '1no2b1' }],
  ['path', { d: 'M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6', key: '1fr6do' }],
  ['path', { d: 'M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2', key: 'donm21' }],
]

/**
 * @component @name Backpack
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAxMGE0IDQgMCAwIDEgNC00aDhhNCA0IDAgMCAxIDQgNHYxMGEyIDIgMCAwIDEtMiAySDZhMiAyIDAgMCAxLTItMnoiIC8+CiAgPHBhdGggZD0iTTggMTBoOCIgLz4KICA8cGF0aCBkPSJNOCAxOGg4IiAvPgogIDxwYXRoIGQ9Ik04IDIydi02YTIgMiAwIDAgMSAyLTJoNGEyIDIgMCAwIDEgMiAydjYiIC8+CiAgPHBhdGggZD0iTTkgNlY0YTIgMiAwIDAgMSAyLTJoMmEyIDIgMCAwIDEgMiAydjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/backpack
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Backpack = createLucideIcon('backpack', __iconNode)

export default Backpack
