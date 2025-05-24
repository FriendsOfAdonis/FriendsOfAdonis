import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M7 10H6a4 4 0 0 1-4-4 1 1 0 0 1 1-1h4', key: '1hjpb6' }],
  [
    'path',
    { d: 'M7 5a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1 7 7 0 0 1-7 7H8a1 1 0 0 1-1-1z', key: '1qn45f' },
  ],
  ['path', { d: 'M9 12v5', key: '3anwtq' }],
  ['path', { d: 'M15 12v5', key: '5xh3zn' }],
  [
    'path',
    { d: 'M5 20a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3 1 1 0 0 1-1 1H6a1 1 0 0 1-1-1', key: '1fi4x8' },
  ],
]

/**
 * @component @name Anvil
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNyAxMEg2YTQgNCAwIDAgMS00LTQgMSAxIDAgMCAxIDEtMWg0IiAvPgogIDxwYXRoIGQ9Ik03IDVhMSAxIDAgMCAxIDEtMWgxM2ExIDEgMCAwIDEgMSAxIDcgNyAwIDAgMS03IDdIOGExIDEgMCAwIDEtMS0xeiIgLz4KICA8cGF0aCBkPSJNOSAxMnY1IiAvPgogIDxwYXRoIGQ9Ik0xNSAxMnY1IiAvPgogIDxwYXRoIGQ9Ik01IDIwYTMgMyAwIDAgMSAzLTNoOGEzIDMgMCAwIDEgMyAzIDEgMSAwIDAgMS0xIDFINmExIDEgMCAwIDEtMS0xIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/anvil
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Anvil = createLucideIcon('anvil', __iconNode)

export default Anvil
