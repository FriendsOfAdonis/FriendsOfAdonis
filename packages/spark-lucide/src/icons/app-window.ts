import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { x: '2', y: '4', width: '20', height: '16', rx: '2', key: 'izxlao' }],
  ['path', { d: 'M10 4v4', key: 'pp8u80' }],
  ['path', { d: 'M2 8h20', key: 'd11cs7' }],
  ['path', { d: 'M6 4v4', key: '1svtjw' }],
]

/**
 * @component @name AppWindow
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB4PSIyIiB5PSI0IiB3aWR0aD0iMjAiIGhlaWdodD0iMTYiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik0xMCA0djQiIC8+CiAgPHBhdGggZD0iTTIgOGgyMCIgLz4KICA8cGF0aCBkPSJNNiA0djQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/app-window
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const AppWindow = createLucideIcon('app-window', __iconNode)

export default AppWindow
