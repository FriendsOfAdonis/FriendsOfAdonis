import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3', key: '37hlfg' }],
  ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4', key: 'tnqrlb' }],
  ['circle', { cx: '8', cy: '16', r: '6', key: '10v15b' }],
  ['path', { d: 'M9.5 17.5 8 16.25V14', key: '1o80t2' }],
]

/**
 * @component @name FileClock
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgMjJoMmEyIDIgMCAwIDAgMi0yVjdsLTUtNUg2YTIgMiAwIDAgMC0yIDJ2MyIgLz4KICA8cGF0aCBkPSJNMTQgMnY0YTIgMiAwIDAgMCAyIDJoNCIgLz4KICA8Y2lyY2xlIGN4PSI4IiBjeT0iMTYiIHI9IjYiIC8+CiAgPHBhdGggZD0iTTkuNSAxNy41IDggMTYuMjVWMTQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/file-clock
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const FileClock = createLucideIcon('file-clock', __iconNode)

export default FileClock
