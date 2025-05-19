import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M18.36 6.64A9 9 0 0 1 20.77 15', key: 'dxknvb' }],
  ['path', { d: 'M6.16 6.16a9 9 0 1 0 12.68 12.68', key: '1x7qb5' }],
  ['path', { d: 'M12 2v4', key: '3427ic' }],
  ['path', { d: 'm2 2 20 20', key: '1ooewy' }],
]

/**
 * @component @name PowerOff
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTguMzYgNi42NEE5IDkgMCAwIDEgMjAuNzcgMTUiIC8+CiAgPHBhdGggZD0iTTYuMTYgNi4xNmE5IDkgMCAxIDAgMTIuNjggMTIuNjgiIC8+CiAgPHBhdGggZD0iTTEyIDJ2NCIgLz4KICA8cGF0aCBkPSJtMiAyIDIwIDIwIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/power-off
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const PowerOff = createLucideIcon('power-off', __iconNode)

export default PowerOff
