import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3', key: '14bfxa' }],
  ['path', { d: 'M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3', key: '14rx03' }],
  ['path', { d: 'M4 12H2', key: 'rhcxmi' }],
  ['path', { d: 'M10 12H8', key: 's88cx1' }],
  ['path', { d: 'M16 12h-2', key: '10asgb' }],
  ['path', { d: 'M22 12h-2', key: '14jgyd' }],
]

/**
 * @component @name FlipVertical
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgOFY1YTIgMiAwIDAgMC0yLTJINWEyIDIgMCAwIDAtMiAydjMiIC8+CiAgPHBhdGggZD0iTTIxIDE2djNhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ2LTMiIC8+CiAgPHBhdGggZD0iTTQgMTJIMiIgLz4KICA8cGF0aCBkPSJNMTAgMTJIOCIgLz4KICA8cGF0aCBkPSJNMTYgMTJoLTIiIC8+CiAgPHBhdGggZD0iTTIyIDEyaC0yIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/flip-vertical
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const FlipVertical = createLucideIcon('flip-vertical', __iconNode)

export default FlipVertical
