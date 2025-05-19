export function generateRandom(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charsLength = chars.length

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength))
  }

  return result
}
