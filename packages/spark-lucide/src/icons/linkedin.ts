import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z',
      key: 'c2jq9f',
    },
  ],
  ['rect', { width: '4', height: '12', x: '2', y: '9', key: 'mk3on5' }],
  ['circle', { cx: '4', cy: '4', r: '2', key: 'bt5ra8' }],
]

/**
 * @component @name Linkedin
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgOGE2IDYgMCAwIDEgNiA2djdoLTR2LTdhMiAyIDAgMCAwLTItMiAyIDIgMCAwIDAtMiAydjdoLTR2LTdhNiA2IDAgMCAxIDYtNnoiIC8+CiAgPHJlY3Qgd2lkdGg9IjQiIGhlaWdodD0iMTIiIHg9IjIiIHk9IjkiIC8+CiAgPGNpcmNsZSBjeD0iNCIgY3k9IjQiIHI9IjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/linkedin
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 * @deprecated Brand icons have been deprecated and are due to be removed, please refer to https://github.com/lucide-icons/lucide/issues/670. We recommend using https://simpleicons.org/?q=linkedin instead. This icon will be removed in v1.0
 */
const Linkedin = createLucideIcon('linkedin', __iconNode)

export default Linkedin
