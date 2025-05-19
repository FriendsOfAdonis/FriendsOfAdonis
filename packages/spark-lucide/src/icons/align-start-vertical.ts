import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '9', height: '6', x: '6', y: '14', rx: '2', key: 'lpm2y7' }],
  ['rect', { width: '16', height: '6', x: '6', y: '4', rx: '2', key: 'rdj6ps' }],
  ['path', { d: 'M2 2v20', key: '1ivd8o' }],
]

/**
 * @component @name AlignStartVertical
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iOSIgaGVpZ2h0PSI2IiB4PSI2IiB5PSIxNCIgcng9IjIiIC8+CiAgPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjYiIHg9IjYiIHk9IjQiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik0yIDJ2MjAiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/align-start-vertical
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const AlignStartVertical = createLucideIcon('align-start-vertical', __iconNode)

export default AlignStartVertical
