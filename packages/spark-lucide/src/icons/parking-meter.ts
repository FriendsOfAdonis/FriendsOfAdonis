import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M11 15h2', key: '199qp6' }],
  ['path', { d: 'M12 12v3', key: '158kv8' }],
  ['path', { d: 'M12 19v3', key: 'npa21l' }],
  [
    'path',
    {
      d: 'M15.282 19a1 1 0 0 0 .948-.68l2.37-6.988a7 7 0 1 0-13.2 0l2.37 6.988a1 1 0 0 0 .948.68z',
      key: '1jofit',
    },
  ],
  ['path', { d: 'M9 9a3 3 0 1 1 6 0', key: 'jdoeu8' }],
]

/**
 * @component @name ParkingMeter
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEgMTVoMiIgLz4KICA8cGF0aCBkPSJNMTIgMTJ2MyIgLz4KICA8cGF0aCBkPSJNMTIgMTl2MyIgLz4KICA8cGF0aCBkPSJNMTUuMjgyIDE5YTEgMSAwIDAgMCAuOTQ4LS42OGwyLjM3LTYuOTg4YTcgNyAwIDEgMC0xMy4yIDBsMi4zNyA2Ljk4OGExIDEgMCAwIDAgLjk0OC42OHoiIC8+CiAgPHBhdGggZD0iTTkgOWEzIDMgMCAxIDEgNiAwIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/parking-meter
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const ParkingMeter = createLucideIcon('parking-meter', __iconNode)

export default ParkingMeter
