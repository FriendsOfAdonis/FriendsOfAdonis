import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '10', cy: '7', r: '4', key: 'e45bow' }],
  ['path', { d: 'M10.3 15H7a4 4 0 0 0-4 4v2', key: '3bnktk' }],
  ['circle', { cx: '17', cy: '17', r: '3', key: '18b49y' }],
  ['path', { d: 'm21 21-1.9-1.9', key: '1g2n9r' }],
]

/**
 * @component @name UserSearch
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMCIgY3k9IjciIHI9IjQiIC8+CiAgPHBhdGggZD0iTTEwLjMgMTVIN2E0IDQgMCAwIDAtNCA0djIiIC8+CiAgPGNpcmNsZSBjeD0iMTciIGN5PSIxNyIgcj0iMyIgLz4KICA8cGF0aCBkPSJtMjEgMjEtMS45LTEuOSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/user-search
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const UserSearch = createLucideIcon('user-search', __iconNode)

export default UserSearch
