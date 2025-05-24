import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '8', height: '6', x: '5', y: '4', rx: '1', key: 'nzclkv' }],
  ['rect', { width: '8', height: '6', x: '11', y: '14', rx: '1', key: '4tytwb' }],
]

/**
 * @component @name Ungroup
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI2IiB4PSI1IiB5PSI0IiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI2IiB4PSIxMSIgeT0iMTQiIHJ4PSIxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/ungroup
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Ungroup = createLucideIcon('ungroup', __iconNode)

export default Ungroup
