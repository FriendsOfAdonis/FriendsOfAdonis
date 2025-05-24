import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '10', height: '6', x: '7', y: '9', rx: '2', key: 'b1zbii' }],
  ['path', { d: 'M22 20H2', key: '1p1f7z' }],
  ['path', { d: 'M22 4H2', key: '1b7qnq' }],
]

/**
 * @component @name AlignVerticalSpaceAround
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iNiIgeD0iNyIgeT0iOSIgcng9IjIiIC8+CiAgPHBhdGggZD0iTTIyIDIwSDIiIC8+CiAgPHBhdGggZD0iTTIyIDRIMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/align-vertical-space-around
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const AlignVerticalSpaceAround = createLucideIcon('align-vertical-space-around', __iconNode)

export default AlignVerticalSpaceAround
