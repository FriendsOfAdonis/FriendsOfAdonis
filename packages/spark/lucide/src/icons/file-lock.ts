import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z', key: '1rqfz7' }],
  ['rect', { width: '8', height: '6', x: '8', y: '12', rx: '1', key: '3yr8at' }],
  ['path', { d: 'M10 12v-2a2 2 0 1 1 4 0v2', key: 'j4i8d' }],
]

/**
 * @component @name FileLock
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjdaIiAvPgogIDxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjYiIHg9IjgiIHk9IjEyIiByeD0iMSIgLz4KICA8cGF0aCBkPSJNMTAgMTJ2LTJhMiAyIDAgMSAxIDQgMHYyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/file-lock
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const FileLock = createLucideIcon('file-lock', __iconNode)

export default FileLock
