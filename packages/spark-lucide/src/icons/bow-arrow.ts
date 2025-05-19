import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M17 3h4v4', key: '19p9u1' }],
  [
    'path',
    { d: 'M18.575 11.082a13 13 0 0 1 1.048 9.027 1.17 1.17 0 0 1-1.914.597L14 17', key: '12t3w9' },
  ],
  ['path', { d: 'M7 10 3.29 6.29a1.17 1.17 0 0 1 .6-1.91 13 13 0 0 1 9.03 1.05', key: 'ogng5l' }],
  [
    'path',
    {
      d: 'M7 14a1.7 1.7 0 0 0-1.207.5l-2.646 2.646A.5.5 0 0 0 3.5 18H5a1 1 0 0 1 1 1v1.5a.5.5 0 0 0 .854.354L9.5 18.207A1.7 1.7 0 0 0 10 17v-2a1 1 0 0 0-1-1z',
      key: '8v3fy2',
    },
  ],
  ['path', { d: 'M9.707 14.293 21 3', key: 'ydm3bn' }],
]

/**
 * @component @name BowArrow
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTcgM2g0djQiIC8+CiAgPHBhdGggZD0iTTE4LjU3NSAxMS4wODJhMTMgMTMgMCAwIDEgMS4wNDggOS4wMjcgMS4xNyAxLjE3IDAgMCAxLTEuOTE0LjU5N0wxNCAxNyIgLz4KICA8cGF0aCBkPSJNNyAxMCAzLjI5IDYuMjlhMS4xNyAxLjE3IDAgMCAxIC42LTEuOTEgMTMgMTMgMCAwIDEgOS4wMyAxLjA1IiAvPgogIDxwYXRoIGQ9Ik03IDE0YTEuNyAxLjcgMCAwIDAtMS4yMDcuNWwtMi42NDYgMi42NDZBLjUuNSAwIDAgMCAzLjUgMThINWExIDEgMCAwIDEgMSAxdjEuNWEuNS41IDAgMCAwIC44NTQuMzU0TDkuNSAxOC4yMDdBMS43IDEuNyAwIDAgMCAxMCAxN3YtMmExIDEgMCAwIDAtMS0xeiIgLz4KICA8cGF0aCBkPSJNOS43MDcgMTQuMjkzIDIxIDMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/bow-arrow
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const BowArrow = createLucideIcon('bow-arrow', __iconNode)

export default BowArrow
