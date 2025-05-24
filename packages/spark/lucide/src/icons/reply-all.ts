import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'm12 17-5-5 5-5', key: '1s3y5u' }],
  ['path', { d: 'M22 18v-2a4 4 0 0 0-4-4H7', key: '1fcyog' }],
  ['path', { d: 'm7 17-5-5 5-5', key: '1ed8i2' }],
]

/**
 * @component @name ReplyAll
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTIgMTctNS01IDUtNSIgLz4KICA8cGF0aCBkPSJNMjIgMTh2LTJhNCA0IDAgMCAwLTQtNEg3IiAvPgogIDxwYXRoIGQ9Im03IDE3LTUtNSA1LTUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/reply-all
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const ReplyAll = createLucideIcon('reply-all', __iconNode)

export default ReplyAll
