import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M3 5v14', key: '1nt18q' }],
  ['path', { d: 'M8 5v14', key: '1ybrkv' }],
  ['path', { d: 'M12 5v14', key: 's699le' }],
  ['path', { d: 'M17 5v14', key: 'ycjyhj' }],
  ['path', { d: 'M21 5v14', key: 'nzette' }],
]

/**
 * @component @name Barcode
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyA1djE0IiAvPgogIDxwYXRoIGQ9Ik04IDV2MTQiIC8+CiAgPHBhdGggZD0iTTEyIDV2MTQiIC8+CiAgPHBhdGggZD0iTTE3IDV2MTQiIC8+CiAgPHBhdGggZD0iTTIxIDV2MTQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/barcode
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Barcode = createLucideIcon('barcode', __iconNode)

export default Barcode
