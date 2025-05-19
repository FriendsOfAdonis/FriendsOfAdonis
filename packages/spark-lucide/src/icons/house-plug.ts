import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M10 12V8.964', key: '1vll13' }],
  ['path', { d: 'M14 12V8.964', key: '1x3qvg' }],
  [
    'path',
    { d: 'M15 12a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2a1 1 0 0 1 1-1z', key: 'ppykja' },
  ],
  [
    'path',
    {
      d: 'M8.5 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-2',
      key: '1gvg2z',
    },
  ],
]

/**
 * @component @name HousePlug
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTJWOC45NjQiIC8+CiAgPHBhdGggZD0iTTE0IDEyVjguOTY0IiAvPgogIDxwYXRoIGQ9Ik0xNSAxMmExIDEgMCAwIDEgMSAxdjJhMiAyIDAgMCAxLTIgMmgtNGEyIDIgMCAwIDEtMi0ydi0yYTEgMSAwIDAgMSAxLTF6IiAvPgogIDxwYXRoIGQ9Ik04LjUgMjFINWEyIDIgMCAwIDEtMi0ydi05YTIgMiAwIDAgMSAuNzA5LTEuNTI4bDctNS45OTlhMiAyIDAgMCAxIDIuNTgyIDBsNyA1Ljk5OUEyIDIgMCAwIDEgMjEgMTB2OWEyIDIgMCAwIDEtMiAyaC01YTIgMiAwIDAgMS0yLTJ2LTIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/house-plug
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const HousePlug = createLucideIcon('house-plug', __iconNode)

export default HousePlug
