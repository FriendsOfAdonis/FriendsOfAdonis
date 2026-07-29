/* eslint-disable tsdoc/syntax */
import { createMDX } from 'fumadocs-mdx/next'
import { NextConfig } from 'next'

const withMDX = createMDX()

const config: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@shikijs/twoslash', 'twoslash', '@takumi-rs/image-response'],

  async rewrites() {
    return [
      {
        source: '/docs/:path*.md',
        destination: '/llms.mdx/docs/:path*',
      },
    ]
  },
}

export default withMDX(config)
