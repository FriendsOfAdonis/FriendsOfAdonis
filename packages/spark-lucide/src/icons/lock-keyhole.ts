import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '12', cy: '16', r: '1', key: '1au0dj' }],
  ['rect', { x: '3', y: '10', width: '18', height: '12', rx: '2', key: '6s8ecr' }],
  ['path', { d: 'M7 10V7a5 5 0 0 1 10 0v3', key: '1pqi11' }],
]

/**
 * @component @name LockKeyhole
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjE2IiByPSIxIiAvPgogIDxyZWN0IHg9IjMiIHk9IjEwIiB3aWR0aD0iMTgiIGhlaWdodD0iMTIiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik03IDEwVjdhNSA1IDAgMCAxIDEwIDB2MyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/lock-keyhole
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const LockKeyhole = createLucideIcon('lock-keyhole', __iconNode)

export default LockKeyhole
