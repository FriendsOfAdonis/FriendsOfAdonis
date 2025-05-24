import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M20 7h-3a2 2 0 0 1-2-2V2', key: 'x099mo' }],
  ['path', { d: 'M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z', key: '18t6ie' }],
  ['path', { d: 'M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8', key: '1nja0z' }],
]

/**
 * @component @name Files
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgN2gtM2EyIDIgMCAwIDEtMi0yVjIiIC8+CiAgPHBhdGggZD0iTTkgMThhMiAyIDAgMCAxLTItMlY0YTIgMiAwIDAgMSAyLTJoN2w0IDR2MTBhMiAyIDAgMCAxLTIgMloiIC8+CiAgPHBhdGggZD0iTTMgNy42djEyLjhBMS42IDEuNiAwIDAgMCA0LjYgMjJoOS44IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/files
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Files = createLucideIcon('files', __iconNode)

export default Files
