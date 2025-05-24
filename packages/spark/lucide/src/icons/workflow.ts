import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '8', height: '8', x: '3', y: '3', rx: '2', key: 'by2w9f' }],
  ['path', { d: 'M7 11v4a2 2 0 0 0 2 2h4', key: 'xkn7yn' }],
  ['rect', { width: '8', height: '8', x: '13', y: '13', rx: '2', key: '1cgmvn' }],
]

/**
 * @component @name Workflow
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB4PSIzIiB5PSIzIiByeD0iMiIgLz4KICA8cGF0aCBkPSJNNyAxMXY0YTIgMiAwIDAgMCAyIDJoNCIgLz4KICA8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiB4PSIxMyIgeT0iMTMiIHJ4PSIyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/workflow
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Workflow = createLucideIcon('workflow', __iconNode)

export default Workflow
