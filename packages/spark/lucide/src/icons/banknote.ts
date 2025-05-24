import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '20', height: '12', x: '2', y: '6', rx: '2', key: '9lu3g6' }],
  ['circle', { cx: '12', cy: '12', r: '2', key: '1c9p78' }],
  ['path', { d: 'M6 12h.01M18 12h.01', key: '113zkx' }],
]

/**
 * @component @name Banknote
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTIiIHg9IjIiIHk9IjYiIHJ4PSIyIiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjIiIC8+CiAgPHBhdGggZD0iTTYgMTJoLjAxTTE4IDEyaC4wMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/banknote
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Banknote = createLucideIcon('banknote', __iconNode)

export default Banknote
