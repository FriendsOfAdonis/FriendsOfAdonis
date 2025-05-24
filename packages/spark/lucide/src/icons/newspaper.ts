import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M15 18h-5', key: '95g1m2' }],
  ['path', { d: 'M18 14h-8', key: 'sponae' }],
  [
    'path',
    {
      d: 'M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2',
      key: '39pd36',
    },
  ],
  ['rect', { width: '8', height: '4', x: '10', y: '6', rx: '1', key: 'aywv1n' }],
]

/**
 * @component @name Newspaper
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMThoLTUiIC8+CiAgPHBhdGggZD0iTTE4IDE0aC04IiAvPgogIDxwYXRoIGQ9Ik00IDIyaDE2YTIgMiAwIDAgMCAyLTJWNGEyIDIgMCAwIDAtMi0ySDhhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDEtNCAwdi05YTIgMiAwIDAgMSAyLTJoMiIgLz4KICA8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI0IiB4PSIxMCIgeT0iNiIgcng9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/newspaper
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Newspaper = createLucideIcon('newspaper', __iconNode)

export default Newspaper
