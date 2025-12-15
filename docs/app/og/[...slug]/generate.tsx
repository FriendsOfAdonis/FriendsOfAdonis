import { readFile } from 'node:fs/promises'
import type { ImageResponseOptions } from '@takumi-rs/image-response'
import type { ReactNode } from 'react'

export type GenerateProps = {
  description?: ReactNode
  title: ReactNode
}

const font = readFile('./app/og/[...slug]/Geist-Regular.ttf').then((data) => ({
  name: 'Mono',
  data,
  weight: 400,
}))
const fontBold = readFile('./app/og/[...slug]/Geist-Bold.ttf').then((data) => ({
  name: 'Mono',
  data,
  weight: 600,
}))

export async function getImageResponseOptions(): Promise<ImageResponseOptions> {
  return {
    width: 1_200,
    height: 630,
    format: 'webp',
    fonts: await Promise.all([font, fontBold]),
  }
}

export function generate({ title, description }: GenerateProps) {
  const siteName = 'Fumadocs'
  const primaryTextColor = 'rgb(240,240,240)'
  const logo = (
    <svg filter="url(#logo-shadow)" height="60" viewBox="0 0 180 180" width="60">
      <circle cx="90" cy="90" fill="url(#logo-iconGradient)" r="86" />
      <defs>
        <filter colorInterpolationFilters="sRGB" id="logo-shadow">
          <feDropShadow dx="0" dy="0" floodColor="white" floodOpacity="1" stdDeviation="4" />
        </filter>
        <linearGradient gradientTransform="rotate(45)" id="logo-iconGradient">
          <stop offset="45%" stopColor="black" />
          <stop offset="100%" stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        color: 'white',
        backgroundColor: 'rgb(10,10,10)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '4rem',
        }}
      >
        <span
          style={{
            fontWeight: 600,
            fontSize: '76px',
          }}
        >
          {title}
        </span>
        <p
          style={{
            fontSize: '48px',
            color: 'rgba(240,240,240,0.7)',
          }}
        >
          {description}
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '24px',
            marginTop: 'auto',
            color: primaryTextColor,
          }}
        >
          {logo}
          <span
            style={{
              fontSize: '46px',
              fontWeight: 600,
            }}
          >
            {siteName}
          </span>
        </div>
      </div>
    </div>
  )
}
