import type { ImageResponseOptions } from 'next/dist/compiled/@vercel/og/types'
import { ImageResponse } from 'next/og'
import type { ReactElement, ReactNode } from 'react'

type GenerateProps = {
  description?: ReactNode
  icon?: ReactNode
  primaryColor?: string
  primaryTextColor?: string
  site?: ReactNode
  title: ReactNode
}

export function generateOGImage(options: GenerateProps & ImageResponseOptions): ImageResponse {
  const { title, description, icon, site, primaryColor, primaryTextColor, ...rest } = options

  return new ImageResponse(
    generate({
      title,
      description,
      icon,
      site,
      primaryTextColor,
      primaryColor,
    }),
    {
      width: 1_200,
      height: 630,
      ...rest,
    }
  )
}

export function generate({
  primaryColor = 'rgba(255,150,255,0.5)',
  primaryTextColor = 'rgb(255,150,255)',
  ...props
}: GenerateProps): ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        color: 'white',
        backgroundColor: '#0c0c0c',
        backgroundImage: `linear-gradient(to right top, ${primaryColor}, transparent)`,
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '12px',
            color: primaryTextColor,
          }}
        >
          {props.icon}
          <p
            style={{
              fontSize: '56px',
              fontWeight: 600,
            }}
          >
            {props.site}
          </p>
        </div>

        <p
          style={{
            fontWeight: 800,
            fontSize: '82px',
          }}
        >
          {props.title}
        </p>
        <p
          style={{
            fontSize: '52px',
            color: 'rgba(240,240,240,0.7)',
          }}
        >
          {props.description}
        </p>
      </div>
    </div>
  )
}

type GridPatternProps = {
  readonly className?: string
  readonly height?: number
  readonly squares?: [x: number, y: number][]
  readonly strokeDasharray?: number
  readonly width?: number
  readonly x?: number
  readonly y?: number
}

export function GridPattern({
  width = 100,
  height = 100,
  x = -1,
  y = -1,
  squares,
  strokeDasharray,
  ...props
}: GridPatternProps): ReactElement {
  return (
    <svg
      fill="rgba(156, 163, 175, 0.2)"
      stroke="rgba(156, 163, 175, 0.2)"
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        maskImage: 'radial-gradient(circle at 0% 100%, white, transparent)',
      }}
      viewBox="0 0 600 400"
      {...props}
    >
      <defs>
        <pattern height={height} id="og-pattern" patternUnits="userSpaceOnUse" width={width}>
          <path
            d={`M.5 ${height.toString()}V.5H${width.toString()}`}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeWidth={1}
          />
        </pattern>
      </defs>
      <rect fill="url(#og-pattern)" height="600" strokeWidth={0} width="600" x={x} y={y} />
      {squares?.map(([itemX, itemY]) => (
        <rect
          height={height}
          key={`${itemX.toString()}-${itemY.toString()}`}
          strokeWidth="0"
          width={width - 1}
          x={itemX * width + 1}
          y={itemY * (height + 1)}
        />
      ))}
    </svg>
  )
}
