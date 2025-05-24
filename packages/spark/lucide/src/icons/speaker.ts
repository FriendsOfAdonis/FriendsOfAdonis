import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '16', height: '20', x: '4', y: '2', rx: '2', key: '1nb95v' }],
  ['path', { d: 'M12 6h.01', key: '1vi96p' }],
  ['circle', { cx: '12', cy: '14', r: '4', key: '1jruaj' }],
  ['path', { d: 'M12 14h.01', key: '1etili' }],
]

/**
 * @component @name Speaker
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMjAiIHg9IjQiIHk9IjIiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik0xMiA2aC4wMSIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjE0IiByPSI0IiAvPgogIDxwYXRoIGQ9Ik0xMiAxNGguMDEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/speaker
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Speaker = createLucideIcon('speaker', __iconNode)

export default Speaker
