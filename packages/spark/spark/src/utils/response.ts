import { HttpContext } from '@adonisjs/core/http'

export async function proxyResponse(from: Response, to: HttpContext['response']) {
  to.response.statusCode = from.status
  to.response.statusMessage = from.statusText

  from.headers.forEach((value, key) => {
    to.header(key, value)
  })

  to.send(await from.text())
}
