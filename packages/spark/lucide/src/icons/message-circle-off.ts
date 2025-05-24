import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M20.5 14.9A9 9 0 0 0 9.1 3.5', key: '1iebmn' }],
  ['path', { d: 'm2 2 20 20', key: '1ooewy' }],
  ['path', { d: 'M5.6 5.6C3 8.3 2.2 12.5 4 16l-2 6 6-2c3.4 1.8 7.6 1.1 10.3-1.7', key: '1ov8ce' }],
]

/**
 * @component @name MessageCircleOff
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAuNSAxNC45QTkgOSAwIDAgMCA5LjEgMy41IiAvPgogIDxwYXRoIGQ9Im0yIDIgMjAgMjAiIC8+CiAgPHBhdGggZD0iTTUuNiA1LjZDMyA4LjMgMi4yIDEyLjUgNCAxNmwtMiA2IDYtMmMzLjQgMS44IDcuNiAxLjEgMTAuMy0xLjciIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/message-circle-off
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const MessageCircleOff = createLucideIcon('message-circle-off', __iconNode)

export default MessageCircleOff
