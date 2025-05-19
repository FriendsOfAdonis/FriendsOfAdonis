import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M12 3v12', key: '1x0j5s' }],
  ['path', { d: 'm8 11 4 4 4-4', key: '1dohi6' }],
  [
    'path',
    {
      d: 'M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4',
      key: '1ywtjm',
    },
  ],
]

/**
 * @component @name Import
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgM3YxMiIgLz4KICA8cGF0aCBkPSJtOCAxMSA0IDQgNC00IiAvPgogIDxwYXRoIGQ9Ik04IDVINGEyIDIgMCAwIDAtMiAydjEwYTIgMiAwIDAgMCAyIDJoMTZhMiAyIDAgMCAwIDItMlY3YTIgMiAwIDAgMC0yLTJoLTQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/import
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Import = createLucideIcon('import', __iconNode)

export default Import
