import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M2 22v-5l5-5 5 5-5 5z', key: '1fh25c' }],
  ['path', { d: 'M9.5 14.5 16 8', key: '1smz5x' }],
  [
    'path',
    { d: 'm17 2 5 5-.5.5a3.53 3.53 0 0 1-5 0s0 0 0 0a3.53 3.53 0 0 1 0-5L17 2', key: '1q8uv5' },
  ],
]

/**
 * @component @name Shovel
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMiAyMnYtNWw1LTUgNSA1LTUgNXoiIC8+CiAgPHBhdGggZD0iTTkuNSAxNC41IDE2IDgiIC8+CiAgPHBhdGggZD0ibTE3IDIgNSA1LS41LjVhMy41MyAzLjUzIDAgMCAxLTUgMHMwIDAgMCAwYTMuNTMgMy41MyAwIDAgMSAwLTVMMTcgMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/shovel
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Shovel = createLucideIcon('shovel', __iconNode)

export default Shovel
