import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'm2 2 8 8', key: '1v6059' }],
  ['path', { d: 'm22 2-8 8', key: '173r8a' }],
  ['ellipse', { cx: '12', cy: '9', rx: '10', ry: '5', key: 'liohsx' }],
  ['path', { d: 'M7 13.4v7.9', key: '1yi6u9' }],
  ['path', { d: 'M12 14v8', key: '1tn2tj' }],
  ['path', { d: 'M17 13.4v7.9', key: 'eqz2v3' }],
  ['path', { d: 'M2 9v8a10 5 0 0 0 20 0V9', key: '1750ul' }],
]

/**
 * @component @name Drum
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMiAyIDggOCIgLz4KICA8cGF0aCBkPSJtMjIgMi04IDgiIC8+CiAgPGVsbGlwc2UgY3g9IjEyIiBjeT0iOSIgcng9IjEwIiByeT0iNSIgLz4KICA8cGF0aCBkPSJNNyAxMy40djcuOSIgLz4KICA8cGF0aCBkPSJNMTIgMTR2OCIgLz4KICA8cGF0aCBkPSJNMTcgMTMuNHY3LjkiIC8+CiAgPHBhdGggZD0iTTIgOXY4YTEwIDUgMCAwIDAgMjAgMFY5IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/drum
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Drum = createLucideIcon('drum', __iconNode)

export default Drum
