import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M9 19h6', key: '456am0' }],
  ['path', { d: 'M9 15v-3H5l7-7 7 7h-4v3H9z', key: '1r2uve' }],
]

/**
 * @component @name ArrowBigUpDash
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOSAxOWg2IiAvPgogIDxwYXRoIGQ9Ik05IDE1di0zSDVsNy03IDcgN2gtNHYzSDl6IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/arrow-big-up-dash
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const ArrowBigUpDash = createLucideIcon('arrow-big-up-dash', __iconNode)

export default ArrowBigUpDash
