import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'm18 16 4-4-4-4', key: '1inbqp' }],
  ['path', { d: 'm6 8-4 4 4 4', key: '15zrgr' }],
  ['path', { d: 'm14.5 4-5 16', key: 'e7oirm' }],
]

/**
 * @component @name CodeXml
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTggMTYgNC00LTQtNCIgLz4KICA8cGF0aCBkPSJtNiA4LTQgNCA0IDQiIC8+CiAgPHBhdGggZD0ibTE0LjUgNC01IDE2IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/code-xml
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const CodeXml = createLucideIcon('code-xml', __iconNode)

export default CodeXml
