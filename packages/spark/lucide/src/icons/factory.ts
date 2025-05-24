import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M12 16h.01', key: '1drbdi' }],
  ['path', { d: 'M16 16h.01', key: '1f9h7w' }],
  [
    'path',
    {
      d: 'M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z',
      key: '1iv0i2',
    },
  ],
  ['path', { d: 'M8 16h.01', key: '18s6g9' }],
]

/**
 * @component @name Factory
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMTZoLjAxIiAvPgogIDxwYXRoIGQ9Ik0xNiAxNmguMDEiIC8+CiAgPHBhdGggZD0iTTMgMTlhMiAyIDAgMCAwIDIgMmgxNGEyIDIgMCAwIDAgMi0yVjguNWEuNS41IDAgMCAwLS43NjktLjQyMmwtNC40NjIgMi44NDRBLjUuNSAwIDAgMSAxNSAxMC41di0yYS41LjUgMCAwIDAtLjc2OS0uNDIyTDkuNzcgMTAuOTIyQS41LjUgMCAwIDEgOSAxMC41VjVhMiAyIDAgMCAwLTItMkg1YTIgMiAwIDAgMC0yIDJ6IiAvPgogIDxwYXRoIGQ9Ik04IDE2aC4wMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/factory
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Factory = createLucideIcon('factory', __iconNode)

export default Factory
