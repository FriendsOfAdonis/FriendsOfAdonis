import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2', key: '125lnx' }],
  ['path', { d: 'M8.5 2h7', key: 'csnxdl' }],
  ['path', { d: 'M14.5 16h-5', key: '1ox875' }],
]

/**
 * @component @name TestTube
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTQuNSAydjE3LjVjMCAxLjQtMS4xIDIuNS0yLjUgMi41Yy0xLjQgMC0yLjUtMS4xLTIuNS0yLjVWMiIgLz4KICA8cGF0aCBkPSJNOC41IDJoNyIgLz4KICA8cGF0aCBkPSJNMTQuNSAxNmgtNSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/test-tube
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const TestTube = createLucideIcon('test-tube', __iconNode)

export default TestTube
