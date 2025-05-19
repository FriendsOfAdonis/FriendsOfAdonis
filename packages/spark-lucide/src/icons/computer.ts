import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '14', height: '8', x: '5', y: '2', rx: '2', key: 'wc9tft' }],
  ['rect', { width: '20', height: '8', x: '2', y: '14', rx: '2', key: 'w68u3i' }],
  ['path', { d: 'M6 18h2', key: 'rwmk9e' }],
  ['path', { d: 'M12 18h6', key: 'aqd8w3' }],
]

/**
 * @component @name Computer
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTQiIGhlaWdodD0iOCIgeD0iNSIgeT0iMiIgcng9IjIiIC8+CiAgPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjgiIHg9IjIiIHk9IjE0IiByeD0iMiIgLz4KICA8cGF0aCBkPSJNNiAxOGgyIiAvPgogIDxwYXRoIGQ9Ik0xMiAxOGg2IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/computer
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Computer = createLucideIcon('computer', __iconNode)

export default Computer
