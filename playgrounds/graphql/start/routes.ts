/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import graphql from '@foadonis/graphql/services/main'

router.get('/', async () => 'It works!')

router.route('/graphql', ['GET', 'POST', 'PATCH', 'HEAD', 'OPTIONS'], (ctx) => graphql.handle(ctx))
