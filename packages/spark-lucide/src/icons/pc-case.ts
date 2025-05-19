import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '14', height: '20', x: '5', y: '2', rx: '2', key: '1uq1d7' }],
  ['path', { d: 'M15 14h.01', key: '1kp3bh' }],
  ['path', { d: 'M9 6h6', key: 'dgm16u' }],
  ['path', { d: 'M9 10h6', key: '9gxzsh' }],
]

/**
 * @component @name PcCase
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTQiIGhlaWdodD0iMjAiIHg9IjUiIHk9IjIiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik0xNSAxNGguMDEiIC8+CiAgPHBhdGggZD0iTTkgNmg2IiAvPgogIDxwYXRoIGQ9Ik05IDEwaDYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/pc-case
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const PcCase = createLucideIcon('pc-case', __iconNode)

export default PcCase
