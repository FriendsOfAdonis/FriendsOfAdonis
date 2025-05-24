import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M8 21s-4-3-4-9 4-9 4-9', key: 'uto9ud' }],
  ['path', { d: 'M16 3s4 3 4 9-4 9-4 9', key: '4w2vsq' }],
  ['line', { x1: '15', x2: '9', y1: '9', y2: '15', key: 'f7djnv' }],
  ['line', { x1: '9', x2: '15', y1: '9', y2: '15', key: '1shsy8' }],
]

/**
 * @component @name Variable
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOCAyMXMtNC0zLTQtOSA0LTkgNC05IiAvPgogIDxwYXRoIGQ9Ik0xNiAzczQgMyA0IDktNCA5LTQgOSIgLz4KICA8bGluZSB4MT0iMTUiIHgyPSI5IiB5MT0iOSIgeTI9IjE1IiAvPgogIDxsaW5lIHgxPSI5IiB4Mj0iMTUiIHkxPSI5IiB5Mj0iMTUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/variable
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Variable = createLucideIcon('variable', __iconNode)

export default Variable
