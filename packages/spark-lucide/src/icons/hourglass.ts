import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M5 22h14', key: 'ehvnwv' }],
  ['path', { d: 'M5 2h14', key: 'pdyrp9' }],
  [
    'path',
    {
      d: 'M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22',
      key: '1d314k',
    },
  ],
  [
    'path',
    { d: 'M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2', key: '1vvvr6' },
  ],
]

/**
 * @component @name Hourglass
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAyMmgxNCIgLz4KICA8cGF0aCBkPSJNNSAyaDE0IiAvPgogIDxwYXRoIGQ9Ik0xNyAyMnYtNC4xNzJhMiAyIDAgMCAwLS41ODYtMS40MTRMMTIgMTJsLTQuNDE0IDQuNDE0QTIgMiAwIDAgMCA3IDE3LjgyOFYyMiIgLz4KICA8cGF0aCBkPSJNNyAydjQuMTcyYTIgMiAwIDAgMCAuNTg2IDEuNDE0TDEyIDEybDQuNDE0LTQuNDE0QTIgMiAwIDAgMCAxNyA2LjE3MlYyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/hourglass
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Hourglass = createLucideIcon('hourglass', __iconNode)

export default Hourglass
