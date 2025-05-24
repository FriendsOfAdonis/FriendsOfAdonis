import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M8 2v4', key: '1cmpym' }],
  ['path', { d: 'M12 2v4', key: '3427ic' }],
  ['path', { d: 'M16 2v4', key: '4m81vk' }],
  ['rect', { width: '16', height: '18', x: '4', y: '4', rx: '2', key: '1u9h20' }],
  ['path', { d: 'M8 10h6', key: '3oa6kw' }],
  ['path', { d: 'M8 14h8', key: '1fgep2' }],
  ['path', { d: 'M8 18h5', key: '17enja' }],
]

/**
 * @component @name NotepadText
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOCAydjQiIC8+CiAgPHBhdGggZD0iTTEyIDJ2NCIgLz4KICA8cGF0aCBkPSJNMTYgMnY0IiAvPgogIDxyZWN0IHdpZHRoPSIxNiIgaGVpZ2h0PSIxOCIgeD0iNCIgeT0iNCIgcng9IjIiIC8+CiAgPHBhdGggZD0iTTggMTBoNiIgLz4KICA8cGF0aCBkPSJNOCAxNGg4IiAvPgogIDxwYXRoIGQ9Ik04IDE4aDUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/notepad-text
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const NotepadText = createLucideIcon('notepad-text', __iconNode)

export default NotepadText
