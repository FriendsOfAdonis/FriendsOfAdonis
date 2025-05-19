import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '12', cy: '10', r: '8', key: '1gshiw' }],
  ['circle', { cx: '12', cy: '10', r: '3', key: 'ilqhr7' }],
  ['path', { d: 'M7 22h10', key: '10w4w3' }],
  ['path', { d: 'M12 22v-4', key: '1utk9m' }],
]

/**
 * @component @name Webcam
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSI4IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTAiIHI9IjMiIC8+CiAgPHBhdGggZD0iTTcgMjJoMTAiIC8+CiAgPHBhdGggZD0iTTEyIDIydi00IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/webcam
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Webcam = createLucideIcon('webcam', __iconNode)

export default Webcam
