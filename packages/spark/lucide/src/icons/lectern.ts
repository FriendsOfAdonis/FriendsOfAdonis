import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M16 12h3a2 2 0 0 0 1.902-1.38l1.056-3.333A1 1 0 0 0 21 6H3a1 1 0 0 0-.958 1.287l1.056 3.334A2 2 0 0 0 5 12h3',
      key: '13jjxg',
    },
  ],
  ['path', { d: 'M18 6V3a1 1 0 0 0-1-1h-3', key: '1550fe' }],
  ['rect', { width: '8', height: '12', x: '8', y: '10', rx: '1', key: 'qmu8b6' }],
]

/**
 * @component @name Lectern
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgMTJoM2EyIDIgMCAwIDAgMS45MDItMS4zOGwxLjA1Ni0zLjMzM0ExIDEgMCAwIDAgMjEgNkgzYTEgMSAwIDAgMC0uOTU4IDEuMjg3bDEuMDU2IDMuMzM0QTIgMiAwIDAgMCA1IDEyaDMiIC8+CiAgPHBhdGggZD0iTTE4IDZWM2ExIDEgMCAwIDAtMS0xaC0zIiAvPgogIDxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjEyIiB4PSI4IiB5PSIxMCIgcng9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/lectern
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Lectern = createLucideIcon('lectern', __iconNode)

export default Lectern
