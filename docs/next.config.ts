/* eslint-disable tsdoc/syntax */
import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  serverExternalPackages: ['@shikijs/twoslash', 'twoslash'],
}

export default withMDX(config)
