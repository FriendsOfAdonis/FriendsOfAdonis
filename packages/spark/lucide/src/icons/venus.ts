import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M12 15v7', key: 't2xh3l' }],
  ['path', { d: 'M9 19h6', key: '456am0' }],
  ['circle', { cx: '12', cy: '9', r: '6', key: '1nw4tq' }],
]

/**
 * @component @name Venus
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMTV2NyIgLz4KICA8cGF0aCBkPSJNOSAxOWg2IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iOSIgcj0iNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/venus
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Venus = createLucideIcon('venus', __iconNode)

export default Venus
