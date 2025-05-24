import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M18 11.5V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4', key: 'edstyy' }],
  ['path', { d: 'M14 10V8a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2', key: '19wdwo' }],
  ['path', { d: 'M10 9.9V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v5', key: '1lugqo' }],
  ['path', { d: 'M6 14a2 2 0 0 0-2-2a2 2 0 0 0-2 2', key: '1hbeus' }],
  [
    'path',
    { d: 'M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0', key: '1etffm' },
  ],
]

/**
 * @component @name Grab
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggMTEuNVY5YTIgMiAwIDAgMC0yLTJhMiAyIDAgMCAwLTIgMnYxLjQiIC8+CiAgPHBhdGggZD0iTTE0IDEwVjhhMiAyIDAgMCAwLTItMmEyIDIgMCAwIDAtMiAydjIiIC8+CiAgPHBhdGggZD0iTTEwIDkuOVY5YTIgMiAwIDAgMC0yLTJhMiAyIDAgMCAwLTIgMnY1IiAvPgogIDxwYXRoIGQ9Ik02IDE0YTIgMiAwIDAgMC0yLTJhMiAyIDAgMCAwLTIgMiIgLz4KICA8cGF0aCBkPSJNMTggMTFhMiAyIDAgMSAxIDQgMHYzYTggOCAwIDAgMS04IDhoLTRhOCA4IDAgMCAxLTgtOCAyIDIgMCAxIDEgNCAwIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/grab
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Grab = createLucideIcon('grab', __iconNode)

export default Grab
