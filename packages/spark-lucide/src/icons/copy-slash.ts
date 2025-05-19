import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['line', { x1: '12', x2: '18', y1: '18', y2: '12', key: 'ebkxgr' }],
  ['rect', { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2', key: '17jyea' }],
  ['path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2', key: 'zix9uf' }],
]

/**
 * @component @name CopySlash
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iMTIiIHgyPSIxOCIgeTE9IjE4IiB5Mj0iMTIiIC8+CiAgPHJlY3Qgd2lkdGg9IjE0IiBoZWlnaHQ9IjE0IiB4PSI4IiB5PSI4IiByeD0iMiIgcnk9IjIiIC8+CiAgPHBhdGggZD0iTTQgMTZjLTEuMSAwLTItLjktMi0yVjRjMC0xLjEuOS0yIDItMmgxMGMxLjEgMCAyIC45IDIgMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/copy-slash
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const CopySlash = createLucideIcon('copy-slash', __iconNode)

export default CopySlash
