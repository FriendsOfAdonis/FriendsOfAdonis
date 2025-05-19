import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '18', cy: '18', r: '3', key: '1xkwt0' }],
  ['circle', { cx: '6', cy: '6', r: '3', key: '1lh9wr' }],
  ['path', { d: 'M13 6h3a2 2 0 0 1 2 2v7', key: '1yeb86' }],
  ['line', { x1: '6', x2: '6', y1: '9', y2: '21', key: 'rroup' }],
]

/**
 * @component @name GitPullRequest
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxOCIgY3k9IjE4IiByPSIzIiAvPgogIDxjaXJjbGUgY3g9IjYiIGN5PSI2IiByPSIzIiAvPgogIDxwYXRoIGQ9Ik0xMyA2aDNhMiAyIDAgMCAxIDIgMnY3IiAvPgogIDxsaW5lIHgxPSI2IiB4Mj0iNiIgeTE9IjkiIHkyPSIyMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/git-pull-request
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const GitPullRequest = createLucideIcon('git-pull-request', __iconNode)

export default GitPullRequest
