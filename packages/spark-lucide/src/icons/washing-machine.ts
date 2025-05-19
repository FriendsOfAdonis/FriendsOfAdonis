import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M3 6h3', key: '155dbl' }],
  ['path', { d: 'M17 6h.01', key: 'e2y6kg' }],
  ['rect', { width: '18', height: '20', x: '3', y: '2', rx: '2', key: 'od3kk9' }],
  ['circle', { cx: '12', cy: '13', r: '5', key: 'nlbqau' }],
  ['path', { d: 'M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5', key: '17lach' }],
]

/**
 * @component @name WashingMachine
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyA2aDMiIC8+CiAgPHBhdGggZD0iTTE3IDZoLjAxIiAvPgogIDxyZWN0IHdpZHRoPSIxOCIgaGVpZ2h0PSIyMCIgeD0iMyIgeT0iMiIgcng9IjIiIC8+CiAgPGNpcmNsZSBjeD0iMTIiIGN5PSIxMyIgcj0iNSIgLz4KICA8cGF0aCBkPSJNMTIgMThhMi41IDIuNSAwIDAgMCAwLTUgMi41IDIuNSAwIDAgMSAwLTUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/washing-machine
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const WashingMachine = createLucideIcon('washing-machine', __iconNode)

export default WashingMachine
