import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M18 7c0-5.333-8-5.333-8 0', key: '1prm2n' }],
  ['path', { d: 'M10 7v14', key: '18tmcs' }],
  ['path', { d: 'M6 21h12', key: '4dkmi1' }],
  ['path', { d: 'M6 13h10', key: 'ybwr4a' }],
]

/**
 * @component @name PoundSterling
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggN2MwLTUuMzMzLTgtNS4zMzMtOCAwIiAvPgogIDxwYXRoIGQ9Ik0xMCA3djE0IiAvPgogIDxwYXRoIGQ9Ik02IDIxaDEyIiAvPgogIDxwYXRoIGQ9Ik02IDEzaDEwIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/pound-sterling
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const PoundSterling = createLucideIcon('pound-sterling', __iconNode)

export default PoundSterling
