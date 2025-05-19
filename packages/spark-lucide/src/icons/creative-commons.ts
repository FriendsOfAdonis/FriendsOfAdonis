import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
  [
    'path',
    { d: 'M10 9.3a2.8 2.8 0 0 0-3.5 1 3.1 3.1 0 0 0 0 3.4 2.7 2.7 0 0 0 3.5 1', key: '1ss3eq' },
  ],
  [
    'path',
    { d: 'M17 9.3a2.8 2.8 0 0 0-3.5 1 3.1 3.1 0 0 0 0 3.4 2.7 2.7 0 0 0 3.5 1', key: '1od56t' },
  ],
]

/**
 * @component @name CreativeCommons
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNMTAgOS4zYTIuOCAyLjggMCAwIDAtMy41IDEgMy4xIDMuMSAwIDAgMCAwIDMuNCAyLjcgMi43IDAgMCAwIDMuNSAxIiAvPgogIDxwYXRoIGQ9Ik0xNyA5LjNhMi44IDIuOCAwIDAgMC0zLjUgMSAzLjEgMy4xIDAgMCAwIDAgMy40IDIuNyAyLjcgMCAwIDAgMy41IDEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/creative-commons
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const CreativeCommons = createLucideIcon('creative-commons', __iconNode)

export default CreativeCommons
