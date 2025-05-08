import vite from '@adonisjs/vite/services/main'
import { Vite } from '@foadonis/osmos'
import { OsmosNode } from '@foadonis/osmos/jsx-runtime'

export default function RootLayout({ children }: { children: OsmosNode }) {
  return (
    <html>
      <head>
        <Vite entrypoints={['resources/js/app.js']} />
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href={vite.assetPath('resources/css/app.css')} />
      </head>
      <body className="dark bg-background min-h-screen" x-data>
        {children}
      </body>
    </html>
  )
}
