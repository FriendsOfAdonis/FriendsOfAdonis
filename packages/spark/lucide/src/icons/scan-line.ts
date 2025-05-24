import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M3 7V5a2 2 0 0 1 2-2h2', key: 'aa7l1z' }],
  ['path', { d: 'M17 3h2a2 2 0 0 1 2 2v2', key: '4qcy5o' }],
  ['path', { d: 'M21 17v2a2 2 0 0 1-2 2h-2', key: '6vwrx8' }],
  ['path', { d: 'M7 21H5a2 2 0 0 1-2-2v-2', key: 'ioqczr' }],
  ['path', { d: 'M7 12h10', key: 'b7w52i' }],
]

/**
 * @component @name ScanLine
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyA3VjVhMiAyIDAgMCAxIDItMmgyIiAvPgogIDxwYXRoIGQ9Ik0xNyAzaDJhMiAyIDAgMCAxIDIgMnYyIiAvPgogIDxwYXRoIGQ9Ik0yMSAxN3YyYTIgMiAwIDAgMS0yIDJoLTIiIC8+CiAgPHBhdGggZD0iTTcgMjFINWEyIDIgMCAwIDEtMi0ydi0yIiAvPgogIDxwYXRoIGQ9Ik03IDEyaDEwIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/scan-line
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const ScanLine = createLucideIcon('scan-line', __iconNode)

export default ScanLine
