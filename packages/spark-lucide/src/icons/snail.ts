import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M2 13a6 6 0 1 0 12 0 4 4 0 1 0-8 0 2 2 0 0 0 4 0', key: 'hneq2s' }],
  ['circle', { cx: '10', cy: '13', r: '8', key: '194lz3' }],
  ['path', { d: 'M2 21h12c4.4 0 8-3.6 8-8V7a2 2 0 1 0-4 0v6', key: 'ixqyt7' }],
  ['path', { d: 'M18 3 19.1 5.2', key: '9tjm43' }],
  ['path', { d: 'M22 3 20.9 5.2', key: 'j3odrs' }],
]

/**
 * @component @name Snail
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMiAxM2E2IDYgMCAxIDAgMTIgMCA0IDQgMCAxIDAtOCAwIDIgMiAwIDAgMCA0IDAiIC8+CiAgPGNpcmNsZSBjeD0iMTAiIGN5PSIxMyIgcj0iOCIgLz4KICA8cGF0aCBkPSJNMiAyMWgxMmM0LjQgMCA4LTMuNiA4LThWN2EyIDIgMCAxIDAtNCAwdjYiIC8+CiAgPHBhdGggZD0iTTE4IDMgMTkuMSA1LjIiIC8+CiAgPHBhdGggZD0iTTIyIDMgMjAuOSA1LjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/snail
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const Snail = createLucideIcon('snail', __iconNode)

export default Snail
