import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7m-7 0h7', key: '1a2nng' }],
]

/**
 * @component @name Framer
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAxNlY5aDE0VjJINWwxNCAxNGgtN20tNyAwIDcgN3YtN20tNyAwaDciIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/framer
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 * @deprecated Brand icons have been deprecated and are due to be removed, please refer to https://github.com/lucide-icons/lucide/issues/670. We recommend using https://simpleicons.org/?q=framer instead. This icon will be removed in v1.0
 */
const Framer = createLucideIcon('framer', __iconNode)

export default Framer
