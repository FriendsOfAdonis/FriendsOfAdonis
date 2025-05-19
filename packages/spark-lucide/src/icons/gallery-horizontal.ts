import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M2 3v18', key: 'pzttux' }],
  ['rect', { width: '12', height: '18', x: '6', y: '3', rx: '2', key: 'btr8bg' }],
  ['path', { d: 'M22 3v18', key: '6jf3v' }],
]

/**
 * @component @name GalleryHorizontal
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMiAzdjE4IiAvPgogIDxyZWN0IHdpZHRoPSIxMiIgaGVpZ2h0PSIxOCIgeD0iNiIgeT0iMyIgcng9IjIiIC8+CiAgPHBhdGggZD0iTTIyIDN2MTgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/gallery-horizontal
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const GalleryHorizontal = createLucideIcon('gallery-horizontal', __iconNode)

export default GalleryHorizontal
