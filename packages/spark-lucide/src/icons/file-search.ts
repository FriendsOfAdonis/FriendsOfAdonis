import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4', key: 'tnqrlb' }],
  [
    'path',
    { d: 'M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3', key: 'ms7g94' },
  ],
  ['path', { d: 'm9 18-1.5-1.5', key: '1j6qii' }],
  ['circle', { cx: '5', cy: '14', r: '3', key: 'ufru5t' }],
]

/**
 * @component @name FileSearch
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTQgMnY0YTIgMiAwIDAgMCAyIDJoNCIgLz4KICA8cGF0aCBkPSJNNC4yNjggMjFhMiAyIDAgMCAwIDEuNzI3IDFIMThhMiAyIDAgMCAwIDItMlY3bC01LTVINmEyIDIgMCAwIDAtMiAydjMiIC8+CiAgPHBhdGggZD0ibTkgMTgtMS41LTEuNSIgLz4KICA8Y2lyY2xlIGN4PSI1IiBjeT0iMTQiIHI9IjMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/file-search
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const FileSearch = createLucideIcon('file-search', __iconNode)

export default FileSearch
