import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M16.85 18.58a9 9 0 1 0-9.7 0', key: 'd71mpg' }],
  ['path', { d: 'M8 14a5 5 0 1 1 8 0', key: 'fc81rn' }],
  ['circle', { cx: '12', cy: '11', r: '1', key: '1gvufo' }],
  ['path', { d: 'M13 17a1 1 0 1 0-2 0l.5 4.5a.5.5 0 1 0 1 0Z', key: 'za5kbj' }],
]

/**
 * @component @name Podcast
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYuODUgMTguNThhOSA5IDAgMSAwLTkuNyAwIiAvPgogIDxwYXRoIGQ9Ik04IDE0YTUgNSAwIDEgMSA4IDAiIC8+CiAgPGNpcmNsZSBjeD0iMTIiIGN5PSIxMSIgcj0iMSIgLz4KICA8cGF0aCBkPSJNMTMgMTdhMSAxIDAgMSAwLTIgMGwuNSA0LjVhLjUuNSAwIDEgMCAxIDBaIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/podcast
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Podcast = createLucideIcon('podcast', __iconNode)

export default Podcast
