import { PrivateKey } from 'eciesjs'

export function keypair(privateKey?: string) {
  const kp = privateKey ? new PrivateKey(Buffer.from(privateKey, 'hex')) : new PrivateKey()

  return {
    publicKey: kp.publicKey.toHex(),
    privateKey: kp.secret.toString('hex'),
  }
}
