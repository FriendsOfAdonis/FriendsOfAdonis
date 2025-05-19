import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '12', height: '12', x: '2', y: '10', rx: '2', ry: '2', key: '6agr2n' }],
  [
    'path',
    { d: 'm17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6', key: '1o487t' },
  ],
  ['path', { d: 'M6 18h.01', key: 'uhywen' }],
  ['path', { d: 'M10 14h.01', key: 'ssrbsk' }],
  ['path', { d: 'M15 6h.01', key: 'cblpky' }],
  ['path', { d: 'M18 9h.01', key: '2061c0' }],
]

/**
 * @component @name Dices
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHg9IjIiIHk9IjEwIiByeD0iMiIgcnk9IjIiIC8+CiAgPHBhdGggZD0ibTE3LjkyIDE0IDMuNS0zLjVhMi4yNCAyLjI0IDAgMCAwIDAtM2wtNS00LjkyYTIuMjQgMi4yNCAwIDAgMC0zIDBMMTAgNiIgLz4KICA8cGF0aCBkPSJNNiAxOGguMDEiIC8+CiAgPHBhdGggZD0iTTEwIDE0aC4wMSIgLz4KICA8cGF0aCBkPSJNMTUgNmguMDEiIC8+CiAgPHBhdGggZD0iTTE4IDloLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/dices
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Dices = createLucideIcon('dices', __iconNode)

export default Dices
