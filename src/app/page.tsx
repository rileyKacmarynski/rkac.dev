import { compareDesc } from 'date-fns'
import Link from 'next/link'
import { headers } from 'next/headers'
import { getBlogPosts } from '@/app/blog/utils'
import { Anchor } from '@/components/ui/Anchor'

export default function Home() {
  let posts = getBlogPosts()
    .filter((p) => p.data.date || headers().get('host')?.includes('localhost'))
    .sort((a, b) => compareDesc(new Date(a.data.date), new Date(b.data.date)))

  posts = [...posts, ...posts, ...posts]

  return (
    <>
      <div data-prose="true">
        <h1>Hey, I'm Riley</h1>
        <p>
          I'm a fullstack developer from South Dakota. The last few years I've been
          obsessed with learning how to build truly excellent user interfaces.
        </p>
        <p>
          While I don't think I'm quite there yet, I hope this site will document my{' '}
          <Anchor external href="">
            journey
          </Anchor>{' '}
          as I (attempt to) master the web.
        </p>
      </div>
      <section className="mt-6 gap-6 grid grid-cols-2">
        <div className="max-w-3xs">
          <h2 className="text-sm text-muted-fg mb-6">Components</h2>
        </div>
        <div className="max-w-3xs">
          <h2 className="text-sm text-muted-fg mb-6">Blog</h2>
          <ul hover-list="true" className="space-y-6">
            {posts.slice(0, 4).map(({ data, slug }) => (
              <li className="list-none">
                <Link href={`blog/${slug}`} className="flex flex-col gap-1 min-h-20 ">
                  <span className="font-medium text-balance">{data.title}</span>
                  <p className="text-muted-fg text-balance text-sm">{data.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
