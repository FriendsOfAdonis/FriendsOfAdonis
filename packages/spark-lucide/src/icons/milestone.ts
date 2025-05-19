import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M12 13v8', key: '1l5pq0' }],
  ['path', { d: 'M12 3v3', key: '1n5kay' }],
  [
    'path',
    {
      d: 'M4 6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h13a2 2 0 0 0 1.152-.365l3.424-2.317a1 1 0 0 0 0-1.635l-3.424-2.318A2 2 0 0 0 17 6z',
      key: '1btarq',
    },
  ],
]

/**
 * @component @name Milestone
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMTN2OCIgLz4KICA8cGF0aCBkPSJNMTIgM3YzIiAvPgogIDxwYXRoIGQ9Ik00IDZhMSAxIDAgMCAwLTEgMXY1YTEgMSAwIDAgMCAxIDFoMTNhMiAyIDAgMCAwIDEuMTUyLS4zNjVsMy40MjQtMi4zMTdhMSAxIDAgMCAwIDAtMS42MzVsLTMuNDI0LTIuMzE4QTIgMiAwIDAgMCAxNyA2eiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/milestone
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Milestone = createLucideIcon('milestone', __iconNode)

export default Milestone
