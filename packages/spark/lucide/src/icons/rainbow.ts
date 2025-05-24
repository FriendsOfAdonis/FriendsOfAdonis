import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M22 17a10 10 0 0 0-20 0', key: 'ozegv' }],
  ['path', { d: 'M6 17a6 6 0 0 1 12 0', key: '5giftw' }],
  ['path', { d: 'M10 17a2 2 0 0 1 4 0', key: 'gnsikk' }],
]

/**
 * @component @name Rainbow
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjIgMTdhMTAgMTAgMCAwIDAtMjAgMCIgLz4KICA8cGF0aCBkPSJNNiAxN2E2IDYgMCAwIDEgMTIgMCIgLz4KICA8cGF0aCBkPSJNMTAgMTdhMiAyIDAgMCAxIDQgMCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/rainbow
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Rainbow = createLucideIcon('rainbow', __iconNode)

export default Rainbow
