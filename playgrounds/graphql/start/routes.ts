/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { type HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import graphql from '@foadonis/graphql/services/main'

router.get('/', async () => 'It works!')

graphql.registerRoute(router)

router.get('/dump-viewer', async ({ request, response }: HttpContext) => {
  const { dumpViewer } = await import('@hot-hook/dump-viewer')

  response.header('Content-Type', 'text/html; charset=utf-8')
  return dumpViewer()
})
