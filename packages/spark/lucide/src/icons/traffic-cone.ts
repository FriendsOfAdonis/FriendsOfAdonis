import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M16.05 10.966a5 2.5 0 0 1-8.1 0', key: 'm5jpwb' }],
  [
    'path',
    {
      d: 'm16.923 14.049 4.48 2.04a1 1 0 0 1 .001 1.831l-8.574 3.9a2 2 0 0 1-1.66 0l-8.574-3.91a1 1 0 0 1 0-1.83l4.484-2.04',
      key: 'rbg3g8',
    },
  ],
  ['path', { d: 'M16.949 14.14a5 2.5 0 1 1-9.9 0L10.063 3.5a2 2 0 0 1 3.874 0z', key: 'vap8c8' }],
  ['path', { d: 'M9.194 6.57a5 2.5 0 0 0 5.61 0', key: '15hn5c' }],
]

/**
 * @component @name TrafficCone
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYuMDUgMTAuOTY2YTUgMi41IDAgMCAxLTguMSAwIiAvPgogIDxwYXRoIGQ9Im0xNi45MjMgMTQuMDQ5IDQuNDggMi4wNGExIDEgMCAwIDEgLjAwMSAxLjgzMWwtOC41NzQgMy45YTIgMiAwIDAgMS0xLjY2IDBsLTguNTc0LTMuOTFhMSAxIDAgMCAxIDAtMS44M2w0LjQ4NC0yLjA0IiAvPgogIDxwYXRoIGQ9Ik0xNi45NDkgMTQuMTRhNSAyLjUgMCAxIDEtOS45IDBMMTAuMDYzIDMuNWEyIDIgMCAwIDEgMy44NzQgMHoiIC8+CiAgPHBhdGggZD0iTTkuMTk0IDYuNTdhNSAyLjUgMCAwIDAgNS42MSAwIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/traffic-cone
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const TrafficCone = createLucideIcon('traffic-cone', __iconNode)

export default TrafficCone
