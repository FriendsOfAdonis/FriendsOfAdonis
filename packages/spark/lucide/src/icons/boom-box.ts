import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M4 9V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4', key: 'vvzvr1' }],
  ['path', { d: 'M8 8v1', key: 'xcqmfk' }],
  ['path', { d: 'M12 8v1', key: '1rj8u4' }],
  ['path', { d: 'M16 8v1', key: '1q12zr' }],
  ['rect', { width: '20', height: '12', x: '2', y: '9', rx: '2', key: 'igpb89' }],
  ['circle', { cx: '8', cy: '15', r: '2', key: 'fa4a8s' }],
  ['circle', { cx: '16', cy: '15', r: '2', key: '14c3ya' }],
]

/**
 * @component @name BoomBox
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCA5VjVhMiAyIDAgMCAxIDItMmgxMmEyIDIgMCAwIDEgMiAydjQiIC8+CiAgPHBhdGggZD0iTTggOHYxIiAvPgogIDxwYXRoIGQ9Ik0xMiA4djEiIC8+CiAgPHBhdGggZD0iTTE2IDh2MSIgLz4KICA8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTIiIHg9IjIiIHk9IjkiIHJ4PSIyIiAvPgogIDxjaXJjbGUgY3g9IjgiIGN5PSIxNSIgcj0iMiIgLz4KICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjE1IiByPSIyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/boom-box
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const BoomBox = createLucideIcon('boom-box', __iconNode)

export default BoomBox
