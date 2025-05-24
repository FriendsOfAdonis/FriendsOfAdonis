import 'reflect-metadata'

import { test } from '@japa/runner'
import { setupHttpServer } from '../helpers.js'
import { Link } from '../../src/components/link.js'

test.group('navigation', () => {
  test('navigation should work properly', async ({ visit }) => {
    await setupHttpServer((router) => {
      router.get('/', () => (
        <div>
          <h1>Home</h1>
          <Link href="/users">Users</Link>
        </div>
      ))

      router.get('/users', () => (
        <div>
          <h1>Users</h1>
          <Link href="/">Users</Link>
        </div>
      ))
    })

    const page = await visit('/')

    await page.assertTextContains('h1', 'Home')
    await page.assertTextContains('a', 'Users')
    await page.click('a')

    await page.assertTextContains('h1', 'Users')

    await page.goBack()

    await page.assertTextContains('h1', 'Home')
  })
})
