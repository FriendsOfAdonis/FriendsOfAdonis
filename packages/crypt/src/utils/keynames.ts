export function keynames(type: 'private' | 'public') {
  return [keyname(type), `CRYPT_${type.toUpperCase()}_KEY`]
}

export function keyname(type: 'private' | 'public') {
  const env = process.env.NODE_ENV ?? 'development'

  if (env === 'development') {
    return `CRYPT_${type.toUpperCase()}_KEY`
  }

  return `CRYPT_${type.toUpperCase()}_KEY_${env.toUpperCase()}`
}
