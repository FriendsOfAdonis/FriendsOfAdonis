import { Vite } from '@foadonis/spark'
import { SparkNode } from '@foadonis/spark/jsx'

export default function RootLayout({ children }: { children: SparkNode }) {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Vite entrypoints={['tests/fixtures/js/app.js']} />
      </head>
      <body>{children}</body>
    </html>
  )
}
