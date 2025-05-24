import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M10 6h8', key: 'zvc2xc' }],
  ['path', { d: 'M12 16h6', key: 'yi5mkt' }],
  ['path', { d: 'M3 3v16a2 2 0 0 0 2 2h16', key: 'c24i48' }],
  ['path', { d: 'M8 11h7', key: 'wz2hg0' }],
]

/**
 * @component @name ChartGantt
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgNmg4IiAvPgogIDxwYXRoIGQ9Ik0xMiAxNmg2IiAvPgogIDxwYXRoIGQ9Ik0zIDN2MTZhMiAyIDAgMCAwIDIgMmgxNiIgLz4KICA8cGF0aCBkPSJNOCAxMWg3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/chart-gantt
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const ChartGantt = createLucideIcon('chart-gantt', __iconNode)

export default ChartGantt
