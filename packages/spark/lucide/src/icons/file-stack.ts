import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M21 7h-3a2 2 0 0 1-2-2V2', key: '9rb54x' }],
  [
    'path',
    {
      d: 'M21 6v6.5c0 .8-.7 1.5-1.5 1.5h-7c-.8 0-1.5-.7-1.5-1.5v-9c0-.8.7-1.5 1.5-1.5H17Z',
      key: '1059l0',
    },
  ],
  ['path', { d: 'M7 8v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H15', key: '16874u' }],
  ['path', { d: 'M3 12v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H11', key: 'k2ox98' }],
]

/**
 * @component @name FileStack
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgN2gtM2EyIDIgMCAwIDEtMi0yVjIiIC8+CiAgPHBhdGggZD0iTTIxIDZ2Ni41YzAgLjgtLjcgMS41LTEuNSAxLjVoLTdjLS44IDAtMS41LS43LTEuNS0xLjV2LTljMC0uOC43LTEuNSAxLjUtMS41SDE3WiIgLz4KICA8cGF0aCBkPSJNNyA4djguOGMwIC4zLjIuNi40LjguMi4yLjUuNC44LjRIMTUiIC8+CiAgPHBhdGggZD0iTTMgMTJ2OC44YzAgLjMuMi42LjQuOC4yLjIuNS40LjguNEgxMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/file-stack
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const FileStack = createLucideIcon('file-stack', __iconNode)

export default FileStack
