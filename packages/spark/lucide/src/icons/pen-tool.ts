import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z',
      key: 'nt11vn',
    },
  ],
  [
    'path',
    {
      d: 'm18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18',
      key: '15qc1e',
    },
  ],
  ['path', { d: 'm2.3 2.3 7.286 7.286', key: '1wuzzi' }],
  ['circle', { cx: '11', cy: '11', r: '2', key: 'xmgehs' }],
]

/**
 * @component @name PenTool
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUuNzA3IDIxLjI5M2ExIDEgMCAwIDEtMS40MTQgMGwtMS41ODYtMS41ODZhMSAxIDAgMCAxIDAtMS40MTRsNS41ODYtNS41ODZhMSAxIDAgMCAxIDEuNDE0IDBsMS41ODYgMS41ODZhMSAxIDAgMCAxIDAgMS40MTR6IiAvPgogIDxwYXRoIGQ9Im0xOCAxMy0xLjM3NS02Ljg3NGExIDEgMCAwIDAtLjc0Ni0uNzc2TDMuMjM1IDIuMDI4YTEgMSAwIDAgMC0xLjIwNyAxLjIwN0w1LjM1IDE1Ljg3OWExIDEgMCAwIDAgLjc3Ni43NDZMMTMgMTgiIC8+CiAgPHBhdGggZD0ibTIuMyAyLjMgNy4yODYgNy4yODYiIC8+CiAgPGNpcmNsZSBjeD0iMTEiIGN5PSIxMSIgcj0iMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/pen-tool
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const PenTool = createLucideIcon('pen-tool', __iconNode)

export default PenTool
