import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '18', height: '7', x: '3', y: '3', rx: '1', key: 'f1a2em' }],
  ['rect', { width: '9', height: '7', x: '3', y: '14', rx: '1', key: 'jqznyg' }],
  ['rect', { width: '5', height: '7', x: '16', y: '14', rx: '1', key: 'q5h2i8' }],
]

/**
 * @component @name LayoutTemplate
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iNyIgeD0iMyIgeT0iMyIgcng9IjEiIC8+CiAgPHJlY3Qgd2lkdGg9IjkiIGhlaWdodD0iNyIgeD0iMyIgeT0iMTQiIHJ4PSIxIiAvPgogIDxyZWN0IHdpZHRoPSI1IiBoZWlnaHQ9IjciIHg9IjE2IiB5PSIxNCIgcng9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/layout-template
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const LayoutTemplate = createLucideIcon('layout-template', __iconNode)

export default LayoutTemplate
