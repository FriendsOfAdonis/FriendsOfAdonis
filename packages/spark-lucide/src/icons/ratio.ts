import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '12', height: '20', x: '6', y: '2', rx: '2', key: '1oxtiu' }],
  ['rect', { width: '20', height: '12', x: '2', y: '6', rx: '2', key: '9lu3g6' }],
]

/**
 * @component @name Ratio
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTIiIGhlaWdodD0iMjAiIHg9IjYiIHk9IjIiIHJ4PSIyIiAvPgogIDxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMiIgeD0iMiIgeT0iNiIgcng9IjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/ratio
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Ratio = createLucideIcon('ratio', __iconNode)

export default Ratio
