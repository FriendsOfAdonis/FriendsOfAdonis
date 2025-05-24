import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '19', cy: '6', r: '3', key: '108a5v' }],
  ['path', { d: 'M22 12v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9', key: '1fet9y' }],
  ['path', { d: 'M12 17v4', key: '1riwvh' }],
  ['path', { d: 'M8 21h8', key: '1ev6f3' }],
]

/**
 * @component @name MonitorDot
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxOSIgY3k9IjYiIHI9IjMiIC8+CiAgPHBhdGggZD0iTTIyIDEydjNhMiAyIDAgMCAxLTIgMkg0YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDkiIC8+CiAgPHBhdGggZD0iTTEyIDE3djQiIC8+CiAgPHBhdGggZD0iTTggMjFoOCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/monitor-dot
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const MonitorDot = createLucideIcon('monitor-dot', __iconNode)

export default MonitorDot
