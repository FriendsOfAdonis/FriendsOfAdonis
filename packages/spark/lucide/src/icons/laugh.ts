import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
  ['path', { d: 'M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12Z', key: 'b2q4dd' }],
  ['line', { x1: '9', x2: '9.01', y1: '9', y2: '9', key: 'yxxnd0' }],
  ['line', { x1: '15', x2: '15.01', y1: '9', y2: '9', key: '1p4y9e' }],
]

/**
 * @component @name Laugh
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNMTggMTNhNiA2IDAgMCAxLTYgNSA2IDYgMCAwIDEtNi01aDEyWiIgLz4KICA8bGluZSB4MT0iOSIgeDI9IjkuMDEiIHkxPSI5IiB5Mj0iOSIgLz4KICA8bGluZSB4MT0iMTUiIHgyPSIxNS4wMSIgeTE9IjkiIHkyPSI5IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/laugh
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Laugh = createLucideIcon('laugh', __iconNode)

export default Laugh
