import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M2 7v10', key: 'a2pl2d' }],
  ['path', { d: 'M6 5v14', key: '1kq3d7' }],
  ['rect', { width: '12', height: '18', x: '10', y: '3', rx: '2', key: '13i7bc' }],
]

/**
 * @component @name GalleryHorizontalEnd
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMiA3djEwIiAvPgogIDxwYXRoIGQ9Ik02IDV2MTQiIC8+CiAgPHJlY3Qgd2lkdGg9IjEyIiBoZWlnaHQ9IjE4IiB4PSIxMCIgeT0iMyIgcng9IjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/gallery-horizontal-end
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const GalleryHorizontalEnd = createLucideIcon('gallery-horizontal-end', __iconNode)

export default GalleryHorizontalEnd
