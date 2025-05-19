import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5', key: 'e61zoh' }],
  ['path', { d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7', key: '1ocrg3' }],
  ['path', { d: 'M20 14v4', key: '1hm744' }],
  ['path', { d: 'M20 22v.01', key: '12bgn6' }],
]

/**
 * @component @name MailWarning
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjIgMTAuNVY2YTIgMiAwIDAgMC0yLTJINGEyIDIgMCAwIDAtMiAydjEyYzAgMS4xLjkgMiAyIDJoMTIuNSIgLz4KICA8cGF0aCBkPSJtMjIgNy04Ljk3IDUuN2ExLjk0IDEuOTQgMCAwIDEtMi4wNiAwTDIgNyIgLz4KICA8cGF0aCBkPSJNMjAgMTR2NCIgLz4KICA8cGF0aCBkPSJNMjAgMjJ2LjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/mail-warning
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const MailWarning = createLucideIcon('mail-warning', __iconNode)

export default MailWarning
