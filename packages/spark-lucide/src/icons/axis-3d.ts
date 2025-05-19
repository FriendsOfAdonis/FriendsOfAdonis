import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M13.5 10.5 15 9', key: '1nsxvm' }],
  ['path', { d: 'M4 4v15a1 1 0 0 0 1 1h15', key: '1w6lkd' }],
  ['path', { d: 'M4.293 19.707 6 18', key: '3g1p8c' }],
  ['path', { d: 'm9 15 1.5-1.5', key: '1xfbes' }],
]

/**
 * @component @name Axis3d
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTMuNSAxMC41IDE1IDkiIC8+CiAgPHBhdGggZD0iTTQgNHYxNWExIDEgMCAwIDAgMSAxaDE1IiAvPgogIDxwYXRoIGQ9Ik00LjI5MyAxOS43MDcgNiAxOCIgLz4KICA8cGF0aCBkPSJtOSAxNSAxLjUtMS41IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/axis-3d
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Axis3d = createLucideIcon('axis-3d', __iconNode)

export default Axis3d
