import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '18.5', cy: '17.5', r: '3.5', key: '15x4ox' }],
  ['circle', { cx: '5.5', cy: '17.5', r: '3.5', key: '1noe27' }],
  ['circle', { cx: '15', cy: '5', r: '1', key: '19l28e' }],
  ['path', { d: 'M12 17.5V14l-3-3 4-3 2 3h2', key: '1npguv' }],
]

/**
 * @component @name Bike
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxOC41IiBjeT0iMTcuNSIgcj0iMy41IiAvPgogIDxjaXJjbGUgY3g9IjUuNSIgY3k9IjE3LjUiIHI9IjMuNSIgLz4KICA8Y2lyY2xlIGN4PSIxNSIgY3k9IjUiIHI9IjEiIC8+CiAgPHBhdGggZD0iTTEyIDE3LjVWMTRsLTMtMyA0LTMgMiAzaDIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/bike
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Bike = createLucideIcon('bike', __iconNode)

export default Bike
