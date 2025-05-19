import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'm18 9-6-6-6 6', key: 'kcunyi' }],
  ['path', { d: 'M12 3v14', key: '7cf3v8' }],
  ['path', { d: 'M5 21h14', key: '11awu3' }],
]

/**
 * @component @name ArrowUpFromLine
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTggOS02LTYtNiA2IiAvPgogIDxwYXRoIGQ9Ik0xMiAzdjE0IiAvPgogIDxwYXRoIGQ9Ik01IDIxaDE0IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/arrow-up-from-line
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const ArrowUpFromLine = createLucideIcon('arrow-up-from-line', __iconNode)

export default ArrowUpFromLine
