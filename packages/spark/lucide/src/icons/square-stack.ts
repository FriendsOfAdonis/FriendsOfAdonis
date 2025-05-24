import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M4 10c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2', key: '4i38lg' }],
  ['path', { d: 'M10 16c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2', key: 'mlte4a' }],
  ['rect', { width: '8', height: '8', x: '14', y: '14', rx: '2', key: '1fa9i4' }],
]

/**
 * @component @name SquareStack
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAxMGMtMS4xIDAtMi0uOS0yLTJWNGMwLTEuMS45LTIgMi0yaDRjMS4xIDAgMiAuOSAyIDIiIC8+CiAgPHBhdGggZD0iTTEwIDE2Yy0xLjEgMC0yLS45LTItMnYtNGMwLTEuMS45LTIgMi0yaDRjMS4xIDAgMiAuOSAyIDIiIC8+CiAgPHJlY3Qgd2lkdGg9IjgiIGhlaWdodD0iOCIgeD0iMTQiIHk9IjE0IiByeD0iMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/square-stack
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const SquareStack = createLucideIcon('square-stack', __iconNode)

export default SquareStack
