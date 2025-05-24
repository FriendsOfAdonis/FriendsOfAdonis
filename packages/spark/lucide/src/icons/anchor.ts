import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M12 22V8', key: 'qkxhtm' }],
  ['path', { d: 'M5 12H2a10 10 0 0 0 20 0h-3', key: '1hv3nh' }],
  ['circle', { cx: '12', cy: '5', r: '3', key: 'rqqgnr' }],
]

/**
 * @component @name Anchor
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMjJWOCIgLz4KICA8cGF0aCBkPSJNNSAxMkgyYTEwIDEwIDAgMCAwIDIwIDBoLTMiIC8+CiAgPGNpcmNsZSBjeD0iMTIiIGN5PSI1IiByPSIzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/anchor
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Anchor = createLucideIcon('anchor', __iconNode)

export default Anchor
