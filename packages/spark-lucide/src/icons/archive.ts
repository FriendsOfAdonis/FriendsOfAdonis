import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '20', height: '5', x: '2', y: '3', rx: '1', key: '1wp1u1' }],
  ['path', { d: 'M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8', key: '1s80jp' }],
  ['path', { d: 'M10 12h4', key: 'a56b0p' }],
]

/**
 * @component @name Archive
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iNSIgeD0iMiIgeT0iMyIgcng9IjEiIC8+CiAgPHBhdGggZD0iTTQgOHYxMWEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWOCIgLz4KICA8cGF0aCBkPSJNMTAgMTJoNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/archive
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Archive = createLucideIcon('archive', __iconNode)

export default Archive
