import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['line', { x1: '18', x2: '18', y1: '20', y2: '4', key: 'cun8e5' }],
  ['polygon', { points: '14,20 4,12 14,4', key: 'ypakod' }],
]

/**
 * @component @name StepBack
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iMTgiIHgyPSIxOCIgeTE9IjIwIiB5Mj0iNCIgLz4KICA8cG9seWdvbiBwb2ludHM9IjE0LDIwIDQsMTIgMTQsNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/step-back
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const StepBack = createLucideIcon('step-back', __iconNode)

export default StepBack
