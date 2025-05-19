import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['polyline', { points: '3.5 2 6.5 12.5 18 12.5', key: 'y3iy52' }],
  ['line', { x1: '9.5', x2: '5.5', y1: '12.5', y2: '20', key: '19vg5i' }],
  ['line', { x1: '15', x2: '18.5', y1: '12.5', y2: '20', key: '1inpmv' }],
  ['path', { d: 'M2.75 18a13 13 0 0 0 18.5 0', key: '1nquas' }],
]

/**
 * @component @name RockingChair
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cG9seWxpbmUgcG9pbnRzPSIzLjUgMiA2LjUgMTIuNSAxOCAxMi41IiAvPgogIDxsaW5lIHgxPSI5LjUiIHgyPSI1LjUiIHkxPSIxMi41IiB5Mj0iMjAiIC8+CiAgPGxpbmUgeDE9IjE1IiB4Mj0iMTguNSIgeTE9IjEyLjUiIHkyPSIyMCIgLz4KICA8cGF0aCBkPSJNMi43NSAxOGExMyAxMyAwIDAgMCAxOC41IDAiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/rocking-chair
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const RockingChair = createLucideIcon('rocking-chair', __iconNode)

export default RockingChair
