import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '12', cy: '12', r: '3', key: '1v7zrd' }],
  ['line', { x1: '3', x2: '9', y1: '12', y2: '12', key: '1dyftd' }],
  ['line', { x1: '15', x2: '21', y1: '12', y2: '12', key: 'oup4p8' }],
]

/**
 * @component @name GitCommitHorizontal
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIiAvPgogIDxsaW5lIHgxPSIzIiB4Mj0iOSIgeTE9IjEyIiB5Mj0iMTIiIC8+CiAgPGxpbmUgeDE9IjE1IiB4Mj0iMjEiIHkxPSIxMiIgeTI9IjEyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/git-commit-horizontal
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const GitCommitHorizontal = createLucideIcon('git-commit-horizontal', __iconNode)

export default GitCommitHorizontal
