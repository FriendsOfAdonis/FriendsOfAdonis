import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'm16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5',
      key: 'ftymec',
    },
  ],
  ['rect', { x: '2', y: '6', width: '14', height: '12', rx: '2', key: '158x01' }],
]

/**
 * @component @name Video
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTYgMTMgNS4yMjMgMy40ODJhLjUuNSAwIDAgMCAuNzc3LS40MTZWNy44N2EuNS41IDAgMCAwLS43NTItLjQzMkwxNiAxMC41IiAvPgogIDxyZWN0IHg9IjIiIHk9IjYiIHdpZHRoPSIxNCIgaGVpZ2h0PSIxMiIgcng9IjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/video
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Video = createLucideIcon('video', __iconNode)

export default Video
