import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['line', { x1: '6', x2: '6', y1: '4', y2: '20', key: 'fy8qot' }],
  ['polygon', { points: '10,4 20,12 10,20', key: '1mc1pf' }],
]

/**
 * @component @name StepForward
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iNiIgeDI9IjYiIHkxPSI0IiB5Mj0iMjAiIC8+CiAgPHBvbHlnb24gcG9pbnRzPSIxMCw0IDIwLDEyIDEwLDIwIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/step-forward
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const StepForward = createLucideIcon('step-forward', __iconNode)

export default StepForward
