import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M20 17a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.9a2 2 0 0 1-1.69-.9l-.81-1.2a2 2 0 0 0-1.67-.9H8a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2Z',
      key: '4u7rpt',
    },
  ],
  ['path', { d: 'M2 8v11a2 2 0 0 0 2 2h14', key: '1eicx1' }],
]

/**
 * @component @name Folders
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgMTdhMiAyIDAgMCAwIDItMlY5YTIgMiAwIDAgMC0yLTJoLTMuOWEyIDIgMCAwIDEtMS42OS0uOWwtLjgxLTEuMmEyIDIgMCAwIDAtMS42Ny0uOUg4YTIgMiAwIDAgMC0yIDJ2OWEyIDIgMCAwIDAgMiAyWiIgLz4KICA8cGF0aCBkPSJNMiA4djExYTIgMiAwIDAgMCAyIDJoMTQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/folders
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Folders = createLucideIcon('folders', __iconNode)

export default Folders
