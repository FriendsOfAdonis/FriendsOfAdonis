import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'm12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12',
      key: '1y3wsu',
    },
  ],
  [
    'path',
    {
      d: 'm18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z',
      key: '110lr1',
    },
  ],
  ['path', { d: 'm2 22 .414-.414', key: 'jhxm08' }],
]

/**
 * @component @name Pipette
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTIgOS04LjQxNCA4LjQxNEEyIDIgMCAwIDAgMyAxOC44Mjh2MS4zNDRhMiAyIDAgMCAxLS41ODYgMS40MTRBMiAyIDAgMCAxIDMuODI4IDIxaDEuMzQ0YTIgMiAwIDAgMCAxLjQxNC0uNTg2TDE1IDEyIiAvPgogIDxwYXRoIGQ9Im0xOCA5IC40LjRhMSAxIDAgMSAxLTMgM2wtMy44LTMuOGExIDEgMCAxIDEgMy0zbC40LjQgMy40LTMuNGExIDEgMCAxIDEgMyAzeiIgLz4KICA8cGF0aCBkPSJtMiAyMiAuNDE0LS40MTQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/pipette
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Pipette = createLucideIcon('pipette', __iconNode)

export default Pipette
