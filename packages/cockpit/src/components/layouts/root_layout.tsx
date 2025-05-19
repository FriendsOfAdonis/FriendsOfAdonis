import { Vite } from '@foadonis/spark'
import { FC, html, SparkNode } from '@foadonis/spark/jsx'
import AppSidebar from '../app_sidebar.js'

export default function RootLayout({ children }: { children?: SparkNode }) {
  return (
    <html data-theme="forest">
      <head>
        <title>Adonis Cockpit</title>
        <Vite entrypoints={['resources/css/cockpit.css', 'resources/js/cockpit.js']} />
        <style>{html`spark-component { display: contents; }`}</style>
      </head>
      <body className="relative min-h-screen bg-background text-foreground flex">
        <AppSidebar />
        <main className="flex-1 p-6">{children}</main>
      </body>
    </html>
  )
}
