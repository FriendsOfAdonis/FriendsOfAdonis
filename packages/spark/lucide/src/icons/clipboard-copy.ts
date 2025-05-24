import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '8', height: '4', x: '8', y: '2', rx: '1', ry: '1', key: 'tgr4d6' }],
  ['path', { d: 'M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2', key: '4jdomd' }],
  ['path', { d: 'M16 4h2a2 2 0 0 1 2 2v4', key: '3hqy98' }],
  ['path', { d: 'M21 14H11', key: '1bme5i' }],
  ['path', { d: 'm15 10-4 4 4 4', key: '5dvupr' }],
]

/**
 * @component @name ClipboardCopy
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI0IiB4PSI4IiB5PSIyIiByeD0iMSIgcnk9IjEiIC8+CiAgPHBhdGggZD0iTTggNEg2YTIgMiAwIDAgMC0yIDJ2MTRhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0ydi0yIiAvPgogIDxwYXRoIGQ9Ik0xNiA0aDJhMiAyIDAgMCAxIDIgMnY0IiAvPgogIDxwYXRoIGQ9Ik0yMSAxNEgxMSIgLz4KICA8cGF0aCBkPSJtMTUgMTAtNCA0IDQgNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/clipboard-copy
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const ClipboardCopy = createLucideIcon('clipboard-copy', __iconNode)

export default ClipboardCopy
