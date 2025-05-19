import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M11 2v2', key: '1539x4' }],
  ['path', { d: 'M5 2v2', key: '1yf1q8' }],
  ['path', { d: 'M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1', key: 'rb5t3r' }],
  ['path', { d: 'M8 15a6 6 0 0 0 12 0v-3', key: 'x18d4x' }],
  ['circle', { cx: '20', cy: '10', r: '2', key: 'ts1r5v' }],
]

/**
 * @component @name Stethoscope
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEgMnYyIiAvPgogIDxwYXRoIGQ9Ik01IDJ2MiIgLz4KICA8cGF0aCBkPSJNNSAzSDRhMiAyIDAgMCAwLTIgMnY0YTYgNiAwIDAgMCAxMiAwVjVhMiAyIDAgMCAwLTItMmgtMSIgLz4KICA8cGF0aCBkPSJNOCAxNWE2IDYgMCAwIDAgMTIgMHYtMyIgLz4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjEwIiByPSIyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/stethoscope
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Stethoscope = createLucideIcon('stethoscope', __iconNode)

export default Stethoscope
