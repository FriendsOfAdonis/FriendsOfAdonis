import vite from '@adonisjs/vite/services/main'
import { Vite } from '@foadonis/spark'
import { SparkNode } from '@foadonis/spark/jsx'

export default function RootLayout({ children }: { children: SparkNode }) {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <Vite entrypoints={['resources/js/app.js']} />
        {/* <link rel="stylesheet" href={vite.assetPath('resources/css/app.css')} /> */}
      </head>
      <body>{children}</body>
    </html>
  )
}
