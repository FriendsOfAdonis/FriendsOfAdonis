import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z',
      key: '1dudjm',
    },
  ],
  [
    'path',
    {
      d: 'M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z',
      key: 'l2t8xc',
    },
  ],
  ['path', { d: 'M16 17h4', key: '1dejxt' }],
  ['path', { d: 'M4 13h4', key: '1bwh8b' }],
]

/**
 * @component @name Footprints
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAxNnYtMi4zOEM0IDExLjUgMi45NyAxMC41IDMgOGMuMDMtMi43MiAxLjQ5LTYgNC41LTZDOS4zNyAyIDEwIDMuOCAxMCA1LjVjMCAzLjExLTIgNS42Ni0yIDguNjhWMTZhMiAyIDAgMSAxLTQgMFoiIC8+CiAgPHBhdGggZD0iTTIwIDIwdi0yLjM4YzAtMi4xMiAxLjAzLTMuMTIgMS01LjYyLS4wMy0yLjcyLTEuNDktNi00LjUtNkMxNC42MyA2IDE0IDcuOCAxNCA5LjVjMCAzLjExIDIgNS42NiAyIDguNjhWMjBhMiAyIDAgMSAwIDQgMFoiIC8+CiAgPHBhdGggZD0iTTE2IDE3aDQiIC8+CiAgPHBhdGggZD0iTTQgMTNoNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/footprints
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Footprints = createLucideIcon('footprints', __iconNode)

export default Footprints
