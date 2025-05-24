import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M16 3h3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-3', key: '1kt8lf' }],
  ['path', { d: 'M8 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h3', key: 'gduv9' }],
]

/**
 * @component @name Brackets
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgM2gzYTEgMSAwIDAgMSAxIDF2MTZhMSAxIDAgMCAxLTEgMWgtMyIgLz4KICA8cGF0aCBkPSJNOCAyMUg1YTEgMSAwIDAgMS0xLTFWNGExIDEgMCAwIDEgMS0xaDMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/brackets
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Brackets = createLucideIcon('brackets', __iconNode)

export default Brackets
