import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '18', height: '14', x: '3', y: '5', rx: '2', ry: '2', key: '12ruh7' }],
  ['path', { d: 'M7 15h4M15 15h2M7 11h2M13 11h4', key: '1ueiar' }],
]

/**
 * @component @name Captions
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTQiIHg9IjMiIHk9IjUiIHJ4PSIyIiByeT0iMiIgLz4KICA8cGF0aCBkPSJNNyAxNWg0TTE1IDE1aDJNNyAxMWgyTTEzIDExaDQiIC8+Cjwvc3ZnPg==) - https://lucide.dev/icons/captions
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Captions = createLucideIcon('captions', __iconNode)

export default Captions
