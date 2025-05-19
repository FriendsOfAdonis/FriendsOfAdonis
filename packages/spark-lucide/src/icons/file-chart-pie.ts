import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M14 2v4a2 2 0 0 0 2 2h4', key: 'tnqrlb' }],
  ['path', { d: 'M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3.5', key: '13ddob' }],
  ['path', { d: 'M4.017 11.512a6 6 0 1 0 8.466 8.475', key: 's6vs5t' }],
  [
    'path',
    {
      d: 'M9 16a1 1 0 0 1-1-1v-4c0-.552.45-1.008.995-.917a6 6 0 0 1 4.922 4.922c.091.544-.365.995-.917.995z',
      key: '1dl6s6',
    },
  ],
]

/**
 * @component @name FileChartPie
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTQgMnY0YTIgMiAwIDAgMCAyIDJoNCIgLz4KICA8cGF0aCBkPSJNMTYgMjJoMmEyIDIgMCAwIDAgMi0yVjdsLTUtNUg2YTIgMiAwIDAgMC0yIDJ2My41IiAvPgogIDxwYXRoIGQ9Ik00LjAxNyAxMS41MTJhNiA2IDAgMSAwIDguNDY2IDguNDc1IiAvPgogIDxwYXRoIGQ9Ik05IDE2YTEgMSAwIDAgMS0xLTF2LTRjMC0uNTUyLjQ1LTEuMDA4Ljk5NS0uOTE3YTYgNiAwIDAgMSA0LjkyMiA0LjkyMmMuMDkxLjU0NC0uMzY1Ljk5NS0uOTE3Ljk5NXoiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/file-chart-pie
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const FileChartPie = createLucideIcon('file-chart-pie', __iconNode)

export default FileChartPie
