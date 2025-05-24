import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['rect', { width: '3', height: '8', x: '13', y: '2', rx: '1.5', key: 'diqz80' }],
  ['path', { d: 'M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5', key: '183iwg' }],
  ['rect', { width: '3', height: '8', x: '8', y: '14', rx: '1.5', key: 'hqg7r1' }],
  ['path', { d: 'M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5', key: '76g71w' }],
  ['rect', { width: '8', height: '3', x: '14', y: '13', rx: '1.5', key: '1kmz0a' }],
  ['path', { d: 'M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5', key: 'jc4sz0' }],
  ['rect', { width: '8', height: '3', x: '2', y: '8', rx: '1.5', key: '1omvl4' }],
  ['path', { d: 'M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5', key: '16f3cl' }],
]

/**
 * @component @name Slack
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMyIgaGVpZ2h0PSI4IiB4PSIxMyIgeT0iMiIgcng9IjEuNSIgLz4KICA8cGF0aCBkPSJNMTkgOC41VjEwaDEuNUExLjUgMS41IDAgMSAwIDE5IDguNSIgLz4KICA8cmVjdCB3aWR0aD0iMyIgaGVpZ2h0PSI4IiB4PSI4IiB5PSIxNCIgcng9IjEuNSIgLz4KICA8cGF0aCBkPSJNNSAxNS41VjE0SDMuNUExLjUgMS41IDAgMSAwIDUgMTUuNSIgLz4KICA8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSIzIiB4PSIxNCIgeT0iMTMiIHJ4PSIxLjUiIC8+CiAgPHBhdGggZD0iTTE1LjUgMTlIMTR2MS41YTEuNSAxLjUgMCAxIDAgMS41LTEuNSIgLz4KICA8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSIzIiB4PSIyIiB5PSI4IiByeD0iMS41IiAvPgogIDxwYXRoIGQ9Ik04LjUgNUgxMFYzLjVBMS41IDEuNSAwIDEgMCA4LjUgNSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/slack
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 * @deprecated Brand icons have been deprecated and are due to be removed, please refer to https://github.com/lucide-icons/lucide/issues/670. We recommend using https://simpleicons.org/?q=slack instead. This icon will be removed in v1.0
 */
const Slack = createLucideIcon('slack', __iconNode)

export default Slack
