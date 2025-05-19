import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
  ['path', { d: 'M16 16s-1.5-2-4-2-4 2-4 2', key: 'epbg0q' }],
  ['path', { d: 'M7.5 8 10 9', key: 'olxxln' }],
  ['path', { d: 'm14 9 2.5-1', key: '1j6cij' }],
  ['path', { d: 'M9 10h.01', key: 'qbtxuw' }],
  ['path', { d: 'M15 10h.01', key: '1qmjsl' }],
]

/**
 * @component @name Angry
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNMTYgMTZzLTEuNS0yLTQtMi00IDItNCAyIiAvPgogIDxwYXRoIGQ9Ik03LjUgOCAxMCA5IiAvPgogIDxwYXRoIGQ9Im0xNCA5IDIuNS0xIiAvPgogIDxwYXRoIGQ9Ik05IDEwaC4wMSIgLz4KICA8cGF0aCBkPSJNMTUgMTBoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/angry
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Angry = createLucideIcon('angry', __iconNode)

export default Angry
