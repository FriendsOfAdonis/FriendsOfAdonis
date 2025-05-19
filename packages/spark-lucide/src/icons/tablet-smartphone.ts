import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '10', height: '14', x: '3', y: '8', rx: '2', key: '1vrsiq' }],
  ['path', { d: 'M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4', key: '1j4zmg' }],
  ['path', { d: 'M8 18h.01', key: 'lrp35t' }],
]

/**
 * @component @name TabletSmartphone
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTQiIHg9IjMiIHk9IjgiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik01IDRhMiAyIDAgMCAxIDItMmgxMmEyIDIgMCAwIDEgMiAydjE2YTIgMiAwIDAgMS0yIDJoLTIuNCIgLz4KICA8cGF0aCBkPSJNOCAxOGguMDEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/tablet-smartphone
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const TabletSmartphone = createLucideIcon('tablet-smartphone', __iconNode)

export default TabletSmartphone
