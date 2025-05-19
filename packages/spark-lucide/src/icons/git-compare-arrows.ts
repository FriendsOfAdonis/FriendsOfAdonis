import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '5', cy: '6', r: '3', key: '1qnov2' }],
  ['path', { d: 'M12 6h5a2 2 0 0 1 2 2v7', key: '1yj91y' }],
  ['path', { d: 'm15 9-3-3 3-3', key: '1lwv8l' }],
  ['circle', { cx: '19', cy: '18', r: '3', key: '1qljk2' }],
  ['path', { d: 'M12 18H7a2 2 0 0 1-2-2V9', key: '16sdep' }],
  ['path', { d: 'm9 15 3 3-3 3', key: '1m3kbl' }],
]

/**
 * @component @name GitCompareArrows
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSI1IiBjeT0iNiIgcj0iMyIgLz4KICA8cGF0aCBkPSJNMTIgNmg1YTIgMiAwIDAgMSAyIDJ2NyIgLz4KICA8cGF0aCBkPSJtMTUgOS0zLTMgMy0zIiAvPgogIDxjaXJjbGUgY3g9IjE5IiBjeT0iMTgiIHI9IjMiIC8+CiAgPHBhdGggZD0iTTEyIDE4SDdhMiAyIDAgMCAxLTItMlY5IiAvPgogIDxwYXRoIGQ9Im05IDE1IDMgMy0zIDMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/git-compare-arrows
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const GitCompareArrows = createLucideIcon('git-compare-arrows', __iconNode)

export default GitCompareArrows
