import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'm2 8 2 2-2 2 2 2-2 2', key: 'sv1b1' }],
  ['path', { d: 'm22 8-2 2 2 2-2 2 2 2', key: '101i4y' }],
  ['rect', { width: '8', height: '14', x: '8', y: '5', rx: '1', key: '1oyrl4' }],
]

/**
 * @component @name Vibrate
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMiA4IDIgMi0yIDIgMiAyLTIgMiIgLz4KICA8cGF0aCBkPSJtMjIgOC0yIDIgMiAyLTIgMiAyIDIiIC8+CiAgPHJlY3Qgd2lkdGg9IjgiIGhlaWdodD0iMTQiIHg9IjgiIHk9IjUiIHJ4PSIxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/vibrate
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Vibrate = createLucideIcon('vibrate', __iconNode)

export default Vibrate
