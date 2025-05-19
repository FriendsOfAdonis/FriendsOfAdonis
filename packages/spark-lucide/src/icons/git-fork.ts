import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '12', cy: '18', r: '3', key: '1mpf1b' }],
  ['circle', { cx: '6', cy: '6', r: '3', key: '1lh9wr' }],
  ['circle', { cx: '18', cy: '6', r: '3', key: '1h7g24' }],
  ['path', { d: 'M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9', key: '1uq4wg' }],
  ['path', { d: 'M12 12v3', key: '158kv8' }],
]

/**
 * @component @name GitFork
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjE4IiByPSIzIiAvPgogIDxjaXJjbGUgY3g9IjYiIGN5PSI2IiByPSIzIiAvPgogIDxjaXJjbGUgY3g9IjE4IiBjeT0iNiIgcj0iMyIgLz4KICA8cGF0aCBkPSJNMTggOXYyYzAgLjYtLjQgMS0xIDFIN2MtLjYgMC0xLS40LTEtMVY5IiAvPgogIDxwYXRoIGQ9Ik0xMiAxMnYzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/git-fork
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const GitFork = createLucideIcon('git-fork', __iconNode)

export default GitFork
