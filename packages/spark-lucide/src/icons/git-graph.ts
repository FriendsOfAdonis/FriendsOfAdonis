import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '5', cy: '6', r: '3', key: '1qnov2' }],
  ['path', { d: 'M5 9v6', key: '158jrl' }],
  ['circle', { cx: '5', cy: '18', r: '3', key: '104gr9' }],
  ['path', { d: 'M12 3v18', key: '108xh3' }],
  ['circle', { cx: '19', cy: '6', r: '3', key: '108a5v' }],
  ['path', { d: 'M16 15.7A9 9 0 0 0 19 9', key: '1e3vqb' }],
]

/**
 * @component @name GitGraph
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSI1IiBjeT0iNiIgcj0iMyIgLz4KICA8cGF0aCBkPSJNNSA5djYiIC8+CiAgPGNpcmNsZSBjeD0iNSIgY3k9IjE4IiByPSIzIiAvPgogIDxwYXRoIGQ9Ik0xMiAzdjE4IiAvPgogIDxjaXJjbGUgY3g9IjE5IiBjeT0iNiIgcj0iMyIgLz4KICA8cGF0aCBkPSJNMTYgMTUuN0E5IDkgMCAwIDAgMTkgOSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/git-graph
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const GitGraph = createLucideIcon('git-graph', __iconNode)

export default GitGraph
