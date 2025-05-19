import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '20', height: '20', x: '2', y: '2', rx: '2', key: '1btzen' }],
  ['circle', { cx: '8', cy: '8', r: '2', key: '14cg06' }],
  ['path', { d: 'M9.414 9.414 12 12', key: 'qz4lzr' }],
  ['path', { d: 'M14.8 14.8 18 18', key: '11flf1' }],
  ['circle', { cx: '8', cy: '16', r: '2', key: '1acxsx' }],
  ['path', { d: 'm18 6-8.586 8.586', key: '11kzk1' }],
]

/**
 * @component @name SquareScissors
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHg9IjIiIHk9IjIiIHJ4PSIyIiAvPgogIDxjaXJjbGUgY3g9IjgiIGN5PSI4IiByPSIyIiAvPgogIDxwYXRoIGQ9Ik05LjQxNCA5LjQxNCAxMiAxMiIgLz4KICA8cGF0aCBkPSJNMTQuOCAxNC44IDE4IDE4IiAvPgogIDxjaXJjbGUgY3g9IjgiIGN5PSIxNiIgcj0iMiIgLz4KICA8cGF0aCBkPSJtMTggNi04LjU4NiA4LjU4NiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/square-scissors
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const SquareScissors = createLucideIcon('square-scissors', __iconNode)

export default SquareScissors
