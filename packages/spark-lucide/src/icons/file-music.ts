import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M10.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v8.4', key: '1d3kfm' }],
  ['path', { d: 'M8 18v-7.7L16 9v7', key: '1oie6o' }],
  ['circle', { cx: '14', cy: '16', r: '2', key: '1bzzi3' }],
  ['circle', { cx: '6', cy: '18', r: '2', key: '1fncim' }],
]

/**
 * @component @name FileMusic
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAuNSAyMkgxOGEyIDIgMCAwIDAgMi0yVjdsLTUtNUg2YTIgMiAwIDAgMC0yIDJ2OC40IiAvPgogIDxwYXRoIGQ9Ik04IDE4di03LjdMMTYgOXY3IiAvPgogIDxjaXJjbGUgY3g9IjE0IiBjeT0iMTYiIHI9IjIiIC8+CiAgPGNpcmNsZSBjeD0iNiIgY3k9IjE4IiByPSIyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/file-music
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const FileMusic = createLucideIcon('file-music', __iconNode)

export default FileMusic
