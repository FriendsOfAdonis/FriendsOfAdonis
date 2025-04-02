import Image from 'next/image'
import Link from 'next/link'
import { blog } from '@/lib/source'

export default function Page() {
  const posts = [...blog.getPages()].sort(
    (a, b) =>
      new Date(b.data.date ?? b.file.name).getTime() -
      new Date(a.data.date ?? a.file.name).getTime()
  )

  return (
    <main className="container mx-auto">
      <h1 className="text-3xl font-semibold mb-6 font-semibold">Friends Of Adonis Blog</h1>
      <div className="grid grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            className="flex flex-col rounded-lg border bg-fd-card overflow-hidden text-fd-card-foreground shadow-md transition-colors @max-lg:col-span-full hover:bg-fd-accent/80"
            href={post.url}
            key={post.url}
          >
            <Image
              alt={post.data.title}
              className="border-b"
              height={185}
              src={post.data.thumbnail}
              width={440}
            />
            <div className="flex-1 flex flex-col p-4">
              <div className="flex-1 mb-4">
                <h2 className="font-semibold">{post.data.title}</h2>
                <p className="text-fd-muted-foreground text-sm">{post.data.description}</p>
              </div>
              <div className="mt-auto text-muted-foreground text-xs">
                {new Date(post.data.date ?? post.file.name).toDateString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
