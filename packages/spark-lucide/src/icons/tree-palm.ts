import { createLucideIcon } from '../icon.js'
import { IconNode } from '../types.js'

export const __iconNode: IconNode = [
  ['path', { d: 'M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4', key: 'foxbe7' }],
  [
    'path',
    { d: 'M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3', key: '18arnh' },
  ],
  [
    'path',
    {
      d: 'M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35',
      key: 'ywahnh',
    },
  ],
  ['path', { d: 'M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14', key: 'ft0feo' }],
]

/**
 * @component @name TreePalm
 * @description Lucide SVG icon component, renders SVG Element with children.
 *
 * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTMgOGMwLTIuNzYtMi40Ni01LTUuNS01UzIgNS4yNCAyIDhoMmwxLTEgMSAxaDQiIC8+CiAgPHBhdGggZD0iTTEzIDcuMTRBNS44MiA1LjgyIDAgMCAxIDE2LjUgNmMzLjA0IDAgNS41IDIuMjQgNS41IDVoLTNsLTEtMS0xIDFoLTMiIC8+CiAgPHBhdGggZD0iTTUuODkgOS43MWMtMi4xNSAyLjE1LTIuMyA1LjQ3LS4zNSA3LjQzbDQuMjQtNC4yNS43LS43LjcxLS43MSAyLjEyLTIuMTJjLTEuOTUtMS45Ni01LjI3LTEuOC03LjQyLjM1IiAvPgogIDxwYXRoIGQ9Ik0xMSAxNS41Yy41IDIuNS0uMTcgNC41LTEgNi41aDRjMi01LjUtLjUtMTItMS0xNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/tree-palm
 * @see https://lucide.dev/guide/packages/lucide-react - Documentation
 *
 * @param {Object} props - Lucide icons props and any valid SVG attribute
 * @returns {JSX.Element} JSX Element
 *
 */
const TreePalm = createLucideIcon('tree-palm', __iconNode)

export default TreePalm
