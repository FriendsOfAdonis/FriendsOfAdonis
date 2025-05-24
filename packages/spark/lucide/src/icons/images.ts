import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M18 22H4a2 2 0 0 1-2-2V6', key: 'pblm9e' }],
  ['path', { d: 'm22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18', key: 'nf6bnh' }],
  ['circle', { cx: '12', cy: '8', r: '2', key: '1822b1' }],
  ['rect', { width: '16', height: '16', x: '6', y: '2', rx: '2', key: '12espp' }],
]

/**
 * @component @name Images
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggMjJINGEyIDIgMCAwIDEtMi0yVjYiIC8+CiAgPHBhdGggZD0ibTIyIDEzLTEuMjk2LTEuMjk2YTIuNDEgMi40MSAwIDAgMC0zLjQwOCAwTDExIDE4IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iOCIgcj0iMiIgLz4KICA8cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHg9IjYiIHk9IjIiIHJ4PSIyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/images
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Images = createLucideIcon('images', __iconNode)

export default Images
