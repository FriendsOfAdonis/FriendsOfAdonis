import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '6', height: '20', x: '4', y: '2', rx: '2', key: '19qu7m' }],
  ['rect', { width: '6', height: '20', x: '14', y: '2', rx: '2', key: '24v0nk' }],
]

/**
 * @component @name StretchVertical
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iNiIgaGVpZ2h0PSIyMCIgeD0iNCIgeT0iMiIgcng9IjIiIC8+CiAgPHJlY3Qgd2lkdGg9IjYiIGhlaWdodD0iMjAiIHg9IjE0IiB5PSIyIiByeD0iMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/stretch-vertical
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const StretchVertical = createLucideIcon('stretch-vertical', __iconNode)

export default StretchVertical
