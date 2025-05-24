import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M13.234 20.252 21 12.3', key: '1cbrk9' }],
  [
    'path',
    {
      d: 'm16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486',
      key: '1pkts6',
    },
  ],
]

/**
 * @component @name Paperclip
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTMuMjM0IDIwLjI1MiAyMSAxMi4zIiAvPgogIDxwYXRoIGQ9Im0xNiA2LTguNDE0IDguNTg2YTIgMiAwIDAgMCAwIDIuODI4IDIgMiAwIDAgMCAyLjgyOCAwbDguNDE0LTguNTg2YTQgNCAwIDAgMCAwLTUuNjU2IDQgNCAwIDAgMC01LjY1NiAwbC04LjQxNSA4LjU4NWE2IDYgMCAxIDAgOC40ODYgOC40ODYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/paperclip
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Paperclip = createLucideIcon('paperclip', __iconNode)

export default Paperclip
