import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M18 11c-1.5 0-2.5.5-3 2', key: '1fod00' }],
  [
    'path',
    {
      d: 'M4 6a2 2 0 0 0-2 2v4a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3a8 8 0 0 0-5 2 8 8 0 0 0-5-2z',
      key: 'd70hit',
    },
  ],
  ['path', { d: 'M6 11c1.5 0 2.5.5 3 2', key: '136fht' }],
]

/**
 * @component @name VenetianMask
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggMTFjLTEuNSAwLTIuNS41LTMgMiIgLz4KICA8cGF0aCBkPSJNNCA2YTIgMiAwIDAgMC0yIDJ2NGE1IDUgMCAwIDAgNSA1IDggOCAwIDAgMSA1IDIgOCA4IDAgMCAxIDUtMiA1IDUgMCAwIDAgNS01VjhhMiAyIDAgMCAwLTItMmgtM2E4IDggMCAwIDAtNSAyIDggOCAwIDAgMC01LTJ6IiAvPgogIDxwYXRoIGQ9Ik02IDExYzEuNSAwIDIuNS41IDMgMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/venetian-mask
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const VenetianMask = createLucideIcon('venetian-mask', __iconNode)

export default VenetianMask
