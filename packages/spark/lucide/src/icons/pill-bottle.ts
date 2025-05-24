import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M18 11h-4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4', key: '17ldeb' }],
  ['path', { d: 'M6 7v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7', key: 'nc37y6' }],
  ['rect', { width: '16', height: '5', x: '4', y: '2', rx: '1', key: '3jeezo' }],
]

/**
 * @component @name PillBottle
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggMTFoLTRhMSAxIDAgMCAwLTEgMXY1YTEgMSAwIDAgMCAxIDFoNCIgLz4KICA8cGF0aCBkPSJNNiA3djEzYTIgMiAwIDAgMCAyIDJoOGEyIDIgMCAwIDAgMi0yVjciIC8+CiAgPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjUiIHg9IjQiIHk9IjIiIHJ4PSIxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/pill-bottle
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const PillBottle = createLucideIcon('pill-bottle', __iconNode)

export default PillBottle
