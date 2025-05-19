import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M3 7V5c0-1.1.9-2 2-2h2', key: 'adw53z' }],
  ['path', { d: 'M17 3h2c1.1 0 2 .9 2 2v2', key: 'an4l38' }],
  ['path', { d: 'M21 17v2c0 1.1-.9 2-2 2h-2', key: '144t0e' }],
  ['path', { d: 'M7 21H5c-1.1 0-2-.9-2-2v-2', key: 'rtnfgi' }],
  ['rect', { width: '7', height: '5', x: '7', y: '7', rx: '1', key: '1eyiv7' }],
  ['rect', { width: '7', height: '5', x: '10', y: '12', rx: '1', key: '1qlmkx' }],
]

/**
 * @component @name Group
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyA3VjVjMC0xLjEuOS0yIDItMmgyIiAvPgogIDxwYXRoIGQ9Ik0xNyAzaDJjMS4xIDAgMiAuOSAyIDJ2MiIgLz4KICA8cGF0aCBkPSJNMjEgMTd2MmMwIDEuMS0uOSAyLTIgMmgtMiIgLz4KICA8cGF0aCBkPSJNNyAyMUg1Yy0xLjEgMC0yLS45LTItMnYtMiIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSI3IiB5PSI3IiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI1IiB4PSIxMCIgeT0iMTIiIHJ4PSIxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/group
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Group = createLucideIcon('group', __iconNode)

export default Group
