/* eslint-disable tsdoc/syntax */
import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  serverExternalPackages: ['@shikijs/twoslash', 'twoslash', '@takumi-rs/image-response'],
}

export default withMDX(config)
