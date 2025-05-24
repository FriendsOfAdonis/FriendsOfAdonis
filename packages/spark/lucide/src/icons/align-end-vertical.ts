import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '16', height: '6', x: '2', y: '4', rx: '2', key: '10wcwx' }],
  ['rect', { width: '9', height: '6', x: '9', y: '14', rx: '2', key: '4p5bwg' }],
  ['path', { d: 'M22 22V2', key: '12ipfv' }],
]

/**
 * @component @name AlignEndVertical
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iNiIgeD0iMiIgeT0iNCIgcng9IjIiIC8+CiAgPHJlY3Qgd2lkdGg9IjkiIGhlaWdodD0iNiIgeD0iOSIgeT0iMTQiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik0yMiAyMlYyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/align-end-vertical
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const AlignEndVertical = createLucideIcon('align-end-vertical', __iconNode)

export default AlignEndVertical
