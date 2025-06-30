import algosearch from 'algoliasearch'
import { sync } from 'fumadocs-core/search/algolia'
import * as fs from 'node:fs'

const content = fs.readFileSync('.next/server/app/static.json.body')

/** @type {import('fumadocs-core/search/algolia').DocumentRecord[]} **/
const indexes = JSON.parse(content.toString())

const client = algosearch('LQJ82JOML4', process.env.ALGOLIA_API_KEY)

sync(client, {
  documents: indexes, // search indexes, can be provided by your content source too
})
