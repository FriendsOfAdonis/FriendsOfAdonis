import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['line', { x1: '12', x2: '18', y1: '12', y2: '18', key: '1rg63v' }],
  ['line', { x1: '12', x2: '18', y1: '18', y2: '12', key: 'ebkxgr' }],
  ['rect', { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2', key: '17jyea' }],
  ['path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2', key: 'zix9uf' }],
]

/**
 * @component @name CopyX
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iMTIiIHgyPSIxOCIgeTE9IjEyIiB5Mj0iMTgiIC8+CiAgPGxpbmUgeDE9IjEyIiB4Mj0iMTgiIHkxPSIxOCIgeTI9IjEyIiAvPgogIDxyZWN0IHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgeD0iOCIgeT0iOCIgcng9IjIiIHJ5PSIyIiAvPgogIDxwYXRoIGQ9Ik00IDE2Yy0xLjEgMC0yLS45LTItMlY0YzAtMS4xLjktMiAyLTJoMTBjMS4xIDAgMiAuOSAyIDIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/copy-x
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const CopyX = createLucideIcon('copy-x', __iconNode)

export default CopyX
