import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M9 5v4', key: '14uxtq' }],
  ['rect', { width: '4', height: '6', x: '7', y: '9', rx: '1', key: 'f4fvz0' }],
  ['path', { d: 'M9 15v2', key: 'r5rk32' }],
  ['path', { d: 'M17 3v2', key: '1l2re6' }],
  ['rect', { width: '4', height: '8', x: '15', y: '5', rx: '1', key: 'z38je5' }],
  ['path', { d: 'M17 13v3', key: '5l0wba' }],
  ['path', { d: 'M3 3v16a2 2 0 0 0 2 2h16', key: 'c24i48' }],
]

/**
 * @component @name ChartCandlestick
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOSA1djQiIC8+CiAgPHJlY3Qgd2lkdGg9IjQiIGhlaWdodD0iNiIgeD0iNyIgeT0iOSIgcng9IjEiIC8+CiAgPHBhdGggZD0iTTkgMTV2MiIgLz4KICA8cGF0aCBkPSJNMTcgM3YyIiAvPgogIDxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjgiIHg9IjE1IiB5PSI1IiByeD0iMSIgLz4KICA8cGF0aCBkPSJNMTcgMTN2MyIgLz4KICA8cGF0aCBkPSJNMyAzdjE2YTIgMiAwIDAgMCAyIDJoMTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/chart-candlestick
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const ChartCandlestick = createLucideIcon('chart-candlestick', __iconNode)

export default ChartCandlestick
