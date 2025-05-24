import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '20', height: '16', x: '2', y: '4', rx: '2', key: '18n3k1' }],
  ['circle', { cx: '8', cy: '10', r: '2', key: '1xl4ub' }],
  ['path', { d: 'M8 12h8', key: '1wcyev' }],
  ['circle', { cx: '16', cy: '10', r: '2', key: 'r14t7q' }],
  ['path', { d: 'm6 20 .7-2.9A1.4 1.4 0 0 1 8.1 16h7.8a1.4 1.4 0 0 1 1.4 1l.7 3', key: 'l01ucn' }],
]

/**
 * @component @name CassetteTape
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTYiIHg9IjIiIHk9IjQiIHJ4PSIyIiAvPgogIDxjaXJjbGUgY3g9IjgiIGN5PSIxMCIgcj0iMiIgLz4KICA8cGF0aCBkPSJNOCAxMmg4IiAvPgogIDxjaXJjbGUgY3g9IjE2IiBjeT0iMTAiIHI9IjIiIC8+CiAgPHBhdGggZD0ibTYgMjAgLjctMi45QTEuNCAxLjQgMCAwIDEgOC4xIDE2aDcuOGExLjQgMS40IDAgMCAxIDEuNCAxbC43IDMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/cassette-tape
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const CassetteTape = createLucideIcon('cassette-tape', __iconNode)

export default CassetteTape
