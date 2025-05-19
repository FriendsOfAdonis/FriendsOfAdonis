import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M16 3h5v5', key: '1806ms' }],
  ['path', { d: 'm21 3-6.75 6.75', key: 'pv0uzu' }],
  ['circle', { cx: '10', cy: '14', r: '6', key: '1qwbdc' }],
]

/**
 * @component @name Mars
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgM2g1djUiIC8+CiAgPHBhdGggZD0ibTIxIDMtNi43NSA2Ljc1IiAvPgogIDxjaXJjbGUgY3g9IjEwIiBjeT0iMTQiIHI9IjYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/mars
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Mars = createLucideIcon('mars', __iconNode)

export default Mars
