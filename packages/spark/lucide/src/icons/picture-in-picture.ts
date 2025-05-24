import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M2 10h6V4', key: 'zwrco' }],
  ['path', { d: 'm2 4 6 6', key: 'ug085t' }],
  ['path', { d: 'M21 10V7a2 2 0 0 0-2-2h-7', key: 'git5jr' }],
  ['path', { d: 'M3 14v2a2 2 0 0 0 2 2h3', key: '1f7fh3' }],
  ['rect', { x: '12', y: '14', width: '10', height: '7', rx: '1', key: '1wjs3o' }],
]

/**
 * @component @name PictureInPicture
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMiAxMGg2VjQiIC8+CiAgPHBhdGggZD0ibTIgNCA2IDYiIC8+CiAgPHBhdGggZD0iTTIxIDEwVjdhMiAyIDAgMCAwLTItMmgtNyIgLz4KICA8cGF0aCBkPSJNMyAxNHYyYTIgMiAwIDAgMCAyIDJoMyIgLz4KICA8cmVjdCB4PSIxMiIgeT0iMTQiIHdpZHRoPSIxMCIgaGVpZ2h0PSI3IiByeD0iMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/picture-in-picture
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const PictureInPicture = createLucideIcon('picture-in-picture', __iconNode)

export default PictureInPicture
