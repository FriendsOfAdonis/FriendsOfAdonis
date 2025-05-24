import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['circle', { cx: '6', cy: '12', r: '4', key: '1ehtga' }],
  ['circle', { cx: '18', cy: '12', r: '4', key: '4vafl8' }],
  ['line', { x1: '6', x2: '18', y1: '16', y2: '16', key: 'pmt8us' }],
]

/**
 * @component @name Voicemail
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSI2IiBjeT0iMTIiIHI9IjQiIC8+CiAgPGNpcmNsZSBjeD0iMTgiIGN5PSIxMiIgcj0iNCIgLz4KICA8bGluZSB4MT0iNiIgeDI9IjE4IiB5MT0iMTYiIHkyPSIxNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/voicemail
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Voicemail = createLucideIcon('voicemail', __iconNode)

export default Voicemail
