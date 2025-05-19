import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M19 15v-2a2 2 0 1 0-4 0v2', key: 'h3d1vz' }],
  ['path', { d: 'M9 17H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3.5', key: 'xsnnhn' }],
  ['rect', { x: '13', y: '15', width: '8', height: '5', rx: '1', key: '1ccwuk' }],
]

/**
 * @component @name MessageSquareLock
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTkgMTV2LTJhMiAyIDAgMSAwLTQgMHYyIiAvPgogIDxwYXRoIGQ9Ik05IDE3SDdsLTQgNFY1YTIgMiAwIDAgMSAyLTJoMTRhMiAyIDAgMCAxIDIgMnYzLjUiIC8+CiAgPHJlY3QgeD0iMTMiIHk9IjE1IiB3aWR0aD0iOCIgaGVpZ2h0PSI1IiByeD0iMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/message-square-lock
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const MessageSquareLock = createLucideIcon('message-square-lock', __iconNode)

export default MessageSquareLock
