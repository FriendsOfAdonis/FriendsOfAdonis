import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M2 12h20', key: '9i4pu4' }],
  ['path', { d: 'M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8', key: 'u0tga0' }],
  ['path', { d: 'm4 8 16-4', key: '16g0ng' }],
  [
    'path',
    {
      d: 'm8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8',
      key: '12cejc',
    },
  ],
]

/**
 * @component @name CookingPot
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMiAxMmgyMCIgLz4KICA8cGF0aCBkPSJNMjAgMTJ2OGEyIDIgMCAwIDEtMiAySDZhMiAyIDAgMCAxLTItMnYtOCIgLz4KICA8cGF0aCBkPSJtNCA4IDE2LTQiIC8+CiAgPHBhdGggZD0ibTguODYgNi43OC0uNDUtMS44MWEyIDIgMCAwIDEgMS40NS0yLjQzbDEuOTQtLjQ4YTIgMiAwIDAgMSAyLjQzIDEuNDZsLjQ1IDEuOCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/cooking-pot
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const CookingPot = createLucideIcon('cooking-pot', __iconNode)

export default CookingPot
