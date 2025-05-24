import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M22 14a8 8 0 0 1-8 8', key: '56vcr3' }],
  ['path', { d: 'M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2', key: '1agjmk' }],
  ['path', { d: 'M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1', key: 'wdbh2u' }],
  ['path', { d: 'M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10', key: '1ibuk9' }],
  [
    'path',
    {
      d: 'M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15',
      key: 'g6ys72',
    },
  ],
]

/**
 * @component @name Pointer
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjIgMTRhOCA4IDAgMCAxLTggOCIgLz4KICA8cGF0aCBkPSJNMTggMTF2LTFhMiAyIDAgMCAwLTItMmEyIDIgMCAwIDAtMiAyIiAvPgogIDxwYXRoIGQ9Ik0xNCAxMFY5YTIgMiAwIDAgMC0yLTJhMiAyIDAgMCAwLTIgMnYxIiAvPgogIDxwYXRoIGQ9Ik0xMCA5LjVWNGEyIDIgMCAwIDAtMi0yYTIgMiAwIDAgMC0yIDJ2MTAiIC8+CiAgPHBhdGggZD0iTTE4IDExYTIgMiAwIDEgMSA0IDB2M2E4IDggMCAwIDEtOCA4aC0yYy0yLjggMC00LjUtLjg2LTUuOTktMi4zNGwtMy42LTMuNmEyIDIgMCAwIDEgMi44My0yLjgyTDcgMTUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/pointer
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Pointer = createLucideIcon('pointer', __iconNode)

export default Pointer
