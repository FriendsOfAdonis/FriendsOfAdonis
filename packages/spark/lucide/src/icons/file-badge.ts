import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3', key: '12ixgl' }],
  ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4', key: 'tnqrlb' }],
  ['path', { d: 'M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z', key: 'u0c8gj' }],
  ['path', { d: 'M7 16.5 8 22l-3-1-3 1 1-5.5', key: '5gm2nr' }],
]

/**
 * @component @name FileBadge
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMjJoNmEyIDIgMCAwIDAgMi0yVjdsLTUtNUg2YTIgMiAwIDAgMC0yIDJ2MyIgLz4KICA8cGF0aCBkPSJNMTQgMnY0YTIgMiAwIDAgMCAyIDJoNCIgLz4KICA8cGF0aCBkPSJNNSAxN2EzIDMgMCAxIDAgMC02IDMgMyAwIDAgMCAwIDZaIiAvPgogIDxwYXRoIGQ9Ik03IDE2LjUgOCAyMmwtMy0xLTMgMSAxLTUuNSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/file-badge
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const FileBadge = createLucideIcon('file-badge', __iconNode)

export default FileBadge
