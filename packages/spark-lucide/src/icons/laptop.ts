import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z',
      key: '1pdavp',
    },
  ],
  ['path', { d: 'M20.054 15.987H3.946', key: '14rxg9' }],
]

/**
 * @component @name Laptop
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTggNWEyIDIgMCAwIDEgMiAydjguNTI2YTIgMiAwIDAgMCAuMjEyLjg5N2wxLjA2OCAyLjEyN2ExIDEgMCAwIDEtLjkgMS40NUgzLjYyYTEgMSAwIDAgMS0uOS0xLjQ1bDEuMDY4LTIuMTI3QTIgMiAwIDAgMCA0IDE1LjUyNlY3YTIgMiAwIDAgMSAyLTJ6IiAvPgogIDxwYXRoIGQ9Ik0yMC4wNTQgMTUuOTg3SDMuOTQ2IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/laptop
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Laptop = createLucideIcon('laptop', __iconNode)

export default Laptop
