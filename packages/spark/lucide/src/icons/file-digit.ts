import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4', key: '1pf5j1' }],
  ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4', key: 'tnqrlb' }],
  ['rect', { width: '4', height: '6', x: '2', y: '12', rx: '2', key: 'jm304g' }],
  ['path', { d: 'M10 12h2v6', key: '12zw74' }],
  ['path', { d: 'M10 18h4', key: '1ulq68' }],
]

/**
 * @component @name FileDigit
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAyMmgxNGEyIDIgMCAwIDAgMi0yVjdsLTUtNUg2YTIgMiAwIDAgMC0yIDJ2NCIgLz4KICA8cGF0aCBkPSJNMTQgMnY0YTIgMiAwIDAgMCAyIDJoNCIgLz4KICA8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI2IiB4PSIyIiB5PSIxMiIgcng9IjIiIC8+CiAgPHBhdGggZD0iTTEwIDEyaDJ2NiIgLz4KICA8cGF0aCBkPSJNMTAgMThoNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/file-digit
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const FileDigit = createLucideIcon('file-digit', __iconNode)

export default FileDigit
