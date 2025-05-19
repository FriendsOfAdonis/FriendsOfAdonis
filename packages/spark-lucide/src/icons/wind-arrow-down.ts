import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M10 2v8', key: 'd4bbey' }],
  ['path', { d: 'M12.8 21.6A2 2 0 1 0 14 18H2', key: '19kp1d' }],
  ['path', { d: 'M17.5 10a2.5 2.5 0 1 1 2 4H2', key: '19kpjc' }],
  ['path', { d: 'm6 6 4 4 4-4', key: 'k13n16' }],
]

/**
 * @component @name WindArrowDown
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMnY4IiAvPgogIDxwYXRoIGQ9Ik0xMi44IDIxLjZBMiAyIDAgMSAwIDE0IDE4SDIiIC8+CiAgPHBhdGggZD0iTTE3LjUgMTBhMi41IDIuNSAwIDEgMSAyIDRIMiIgLz4KICA8cGF0aCBkPSJtNiA2IDQgNCA0LTQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/wind-arrow-down
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const WindArrowDown = createLucideIcon('wind-arrow-down', __iconNode)

export default WindArrowDown
