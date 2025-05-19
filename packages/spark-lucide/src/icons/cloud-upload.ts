import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M12 13v8', key: '1l5pq0' }],
  ['path', { d: 'M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242', key: '1pljnt' }],
  ['path', { d: 'm8 17 4-4 4 4', key: '1quai1' }],
]

/**
 * @component @name CloudUpload
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMTN2OCIgLz4KICA8cGF0aCBkPSJNNCAxNC44OTlBNyA3IDAgMSAxIDE1LjcxIDhoMS43OWE0LjUgNC41IDAgMCAxIDIuNSA4LjI0MiIgLz4KICA8cGF0aCBkPSJtOCAxNyA0LTQgNCA0IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/cloud-upload
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const CloudUpload = createLucideIcon('cloud-upload', __iconNode)

export default CloudUpload
