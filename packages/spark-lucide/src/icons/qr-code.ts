import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '5', height: '5', x: '3', y: '3', rx: '1', key: '1tu5fj' }],
  ['rect', { width: '5', height: '5', x: '16', y: '3', rx: '1', key: '1v8r4q' }],
  ['rect', { width: '5', height: '5', x: '3', y: '16', rx: '1', key: '1x03jg' }],
  ['path', { d: 'M21 16h-3a2 2 0 0 0-2 2v3', key: '177gqh' }],
  ['path', { d: 'M21 21v.01', key: 'ents32' }],
  ['path', { d: 'M12 7v3a2 2 0 0 1-2 2H7', key: '8crl2c' }],
  ['path', { d: 'M3 12h.01', key: 'nlz23k' }],
  ['path', { d: 'M12 3h.01', key: 'n36tog' }],
  ['path', { d: 'M12 16v.01', key: '133mhm' }],
  ['path', { d: 'M16 12h1', key: '1slzba' }],
  ['path', { d: 'M21 12v.01', key: '1lwtk9' }],
  ['path', { d: 'M12 21v-1', key: '1880an' }],
]

/**
 * @component @name QrCode
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiB4PSIzIiB5PSIzIiByeD0iMSIgLz4KICA8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiB4PSIxNiIgeT0iMyIgcng9IjEiIC8+CiAgPHJlY3Qgd2lkdGg9IjUiIGhlaWdodD0iNSIgeD0iMyIgeT0iMTYiIHJ4PSIxIiAvPgogIDxwYXRoIGQ9Ik0yMSAxNmgtM2EyIDIgMCAwIDAtMiAydjMiIC8+CiAgPHBhdGggZD0iTTIxIDIxdi4wMSIgLz4KICA8cGF0aCBkPSJNMTIgN3YzYTIgMiAwIDAgMS0yIDJINyIgLz4KICA8cGF0aCBkPSJNMyAxMmguMDEiIC8+CiAgPHBhdGggZD0iTTEyIDNoLjAxIiAvPgogIDxwYXRoIGQ9Ik0xMiAxNnYuMDEiIC8+CiAgPHBhdGggZD0iTTE2IDEyaDEiIC8+CiAgPHBhdGggZD0iTTIxIDEydi4wMSIgLz4KICA8cGF0aCBkPSJNMTIgMjF2LTEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/qr-code
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const QrCode = createLucideIcon('qr-code', __iconNode)

export default QrCode
