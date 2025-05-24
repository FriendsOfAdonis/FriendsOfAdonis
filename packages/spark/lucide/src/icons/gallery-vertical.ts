import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M3 2h18', key: '15qxfx' }],
  ['rect', { width: '18', height: '12', x: '3', y: '6', rx: '2', key: '1439r6' }],
  ['path', { d: 'M3 22h18', key: '8prr45' }],
]

/**
 * @component @name GalleryVertical
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAyaDE4IiAvPgogIDxyZWN0IHdpZHRoPSIxOCIgaGVpZ2h0PSIxMiIgeD0iMyIgeT0iNiIgcng9IjIiIC8+CiAgPHBhdGggZD0iTTMgMjJoMTgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/gallery-vertical
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const GalleryVertical = createLucideIcon('gallery-vertical', __iconNode)

export default GalleryVertical
