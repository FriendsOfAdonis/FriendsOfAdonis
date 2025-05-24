import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M15.236 22a3 3 0 0 0-2.2-5', key: '21bitc' }],
  ['path', { d: 'M16 20a3 3 0 0 1 3-3h1a2 2 0 0 0 2-2v-2a4 4 0 0 0-4-4V4', key: 'oh0fg0' }],
  ['path', { d: 'M18 13h.01', key: '9veqaj' }],
  [
    'path',
    {
      d: 'M18 6a4 4 0 0 0-4 4 7 7 0 0 0-7 7c0-5 4-5 4-10.5a4.5 4.5 0 1 0-9 0 2.5 2.5 0 0 0 5 0C7 10 3 11 3 17c0 2.8 2.2 5 5 5h10',
      key: '980v8a',
    },
  ],
]

/**
 * @component @name Squirrel
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUuMjM2IDIyYTMgMyAwIDAgMC0yLjItNSIgLz4KICA8cGF0aCBkPSJNMTYgMjBhMyAzIDAgMCAxIDMtM2gxYTIgMiAwIDAgMCAyLTJ2LTJhNCA0IDAgMCAwLTQtNFY0IiAvPgogIDxwYXRoIGQ9Ik0xOCAxM2guMDEiIC8+CiAgPHBhdGggZD0iTTE4IDZhNCA0IDAgMCAwLTQgNCA3IDcgMCAwIDAtNyA3YzAtNSA0LTUgNC0xMC41YTQuNSA0LjUgMCAxIDAtOSAwIDIuNSAyLjUgMCAwIDAgNSAwQzcgMTAgMyAxMSAzIDE3YzAgMi44IDIuMiA1IDUgNWgxMCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/squirrel
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Squirrel = createLucideIcon('squirrel', __iconNode)

export default Squirrel
