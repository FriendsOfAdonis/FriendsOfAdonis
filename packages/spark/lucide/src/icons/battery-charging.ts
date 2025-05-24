import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2', key: '1sdynx' }],
  ['path', { d: 'M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1', key: '1gkd3k' }],
  ['path', { d: 'm11 7-3 5h4l-3 5', key: 'b4a64w' }],
  ['line', { x1: '22', x2: '22', y1: '11', y2: '13', key: '4dh1rd' }],
]

/**
 * @component @name BatteryCharging
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgN2gxYTIgMiAwIDAgMSAyIDJ2NmEyIDIgMCAwIDEtMiAyaC0yIiAvPgogIDxwYXRoIGQ9Ik02IDdINGEyIDIgMCAwIDAtMiAydjZhMiAyIDAgMCAwIDIgMmgxIiAvPgogIDxwYXRoIGQ9Im0xMSA3LTMgNWg0bC0zIDUiIC8+CiAgPGxpbmUgeDE9IjIyIiB4Mj0iMjIiIHkxPSIxMSIgeTI9IjEzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/battery-charging
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const BatteryCharging = createLucideIcon('battery-charging', __iconNode)

export default BatteryCharging
