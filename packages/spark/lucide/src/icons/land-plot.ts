import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'm12 8 6-3-6-3v10', key: 'mvpnpy' }],
  [
    'path',
    {
      d: 'm8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12',
      key: 'ek95tt',
    },
  ],
  ['path', { d: 'm6.49 12.85 11.02 6.3', key: '1kt42w' }],
  ['path', { d: 'M17.51 12.85 6.5 19.15', key: 'v55bdg' }],
]

/**
 * @component @name LandPlot
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTIgOCA2LTMtNi0zdjEwIiAvPgogIDxwYXRoIGQ9Im04IDExLjk5LTUuNSAzLjE0YTEgMSAwIDAgMCAwIDEuNzRsOC41IDQuODZhMiAyIDAgMCAwIDIgMGw4LjUtNC44NmExIDEgMCAwIDAgMC0xLjc0TDE2IDEyIiAvPgogIDxwYXRoIGQ9Im02LjQ5IDEyLjg1IDExLjAyIDYuMyIgLz4KICA8cGF0aCBkPSJNMTcuNTEgMTIuODUgNi41IDE5LjE1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/land-plot
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const LandPlot = createLucideIcon('land-plot', __iconNode)

export default LandPlot
