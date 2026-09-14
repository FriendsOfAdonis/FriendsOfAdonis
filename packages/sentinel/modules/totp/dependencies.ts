import { optionalDependency } from '../../src/helpers.ts'

/**
 * Imports the optional "qrcode" package, used to render the QR code
 * of an authenticator
 */
export const importQRCode = optionalDependency('qrcode', () => import('qrcode'))
