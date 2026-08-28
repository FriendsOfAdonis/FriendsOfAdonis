import { optionalDependency } from '../../src/helpers.ts'

export const importQRCode = optionalDependency('qrcode', () => import('qrcode'))
