import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M14.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4', key: '16lz6z' }],
  ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4', key: 'tnqrlb' }],
  [
    'path',
    {
      d: 'M3 13.1a2 2 0 0 0-1 1.76v3.24a2 2 0 0 0 .97 1.78L6 21.7a2 2 0 0 0 2.03.01L11 19.9a2 2 0 0 0 1-1.76V14.9a2 2 0 0 0-.97-1.78L8 11.3a2 2 0 0 0-2.03-.01Z',
      key: '99pj1s',
    },
  ],
  ['path', { d: 'M7 17v5', key: '1yj1jh' }],
  ['path', { d: 'M11.7 14.2 7 17l-4.7-2.8', key: '1yk8tc' }],
]

/**
 * @component @name FileBox
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTQuNSAyMkgxOGEyIDIgMCAwIDAgMi0yVjdsLTUtNUg2YTIgMiAwIDAgMC0yIDJ2NCIgLz4KICA8cGF0aCBkPSJNMTQgMnY0YTIgMiAwIDAgMCAyIDJoNCIgLz4KICA8cGF0aCBkPSJNMyAxMy4xYTIgMiAwIDAgMC0xIDEuNzZ2My4yNGEyIDIgMCAwIDAgLjk3IDEuNzhMNiAyMS43YTIgMiAwIDAgMCAyLjAzLjAxTDExIDE5LjlhMiAyIDAgMCAwIDEtMS43NlYxNC45YTIgMiAwIDAgMC0uOTctMS43OEw4IDExLjNhMiAyIDAgMCAwLTIuMDMtLjAxWiIgLz4KICA8cGF0aCBkPSJNNyAxN3Y1IiAvPgogIDxwYXRoIGQ9Ik0xMS43IDE0LjIgNyAxN2wtNC43LTIuOCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/file-box
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const FileBox = createLucideIcon('file-box', __iconNode)

export default FileBox
