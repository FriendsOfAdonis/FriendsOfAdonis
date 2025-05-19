import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M2 8h20', key: 'd11cs7' }],
  ['rect', { width: '20', height: '16', x: '2', y: '4', rx: '2', key: '18n3k1' }],
  ['path', { d: 'M6 16h12', key: 'u522kt' }],
]

/**
 * @component @name Dock
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMiA4aDIwIiAvPgogIDxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxNiIgeD0iMiIgeT0iNCIgcng9IjIiIC8+CiAgPHBhdGggZD0iTTYgMTZoMTIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/dock
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Dock = createLucideIcon('dock', __iconNode)

export default Dock
