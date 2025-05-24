import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  [
    'path',
    {
      d: 'M19.929 18.629A1 1 0 0 1 19 20H9a1 1 0 0 1-.928-1.371l2-5A1 1 0 0 1 11 13h6a1 1 0 0 1 .928.629z',
      key: 'u4w2d7',
    },
  ],
  [
    'path',
    { d: 'M6 3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z', key: '15356w' },
  ],
  ['path', { d: 'M8 6h4a2 2 0 0 1 2 2v5', key: '1m6m7x' }],
]

/**
 * @component @name LampWallDown
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTkuOTI5IDE4LjYyOUExIDEgMCAwIDEgMTkgMjBIOWExIDEgMCAwIDEtLjkyOC0xLjM3MWwyLTVBMSAxIDAgMCAxIDExIDEzaDZhMSAxIDAgMCAxIC45MjguNjI5eiIgLz4KICA8cGF0aCBkPSJNNiAzYTIgMiAwIDAgMSAyIDJ2MmEyIDIgMCAwIDEtMiAySDVhMSAxIDAgMCAxLTEtMVY0YTEgMSAwIDAgMSAxLTF6IiAvPgogIDxwYXRoIGQ9Ik04IDZoNGEyIDIgMCAwIDEgMiAydjUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/lamp-wall-down
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const LampWallDown = createLucideIcon('lamp-wall-down', __iconNode)

export default LampWallDown
