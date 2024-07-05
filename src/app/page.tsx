import { compareDesc } from 'date-fns'
import Link from 'next/link'
import { headers } from 'next/headers'
import { getBlogPosts } from '@/app/blog/utils'
import { Anchor } from '@/components/ui/Anchor'

export default function Home() {
  let posts = getBlogPosts()
    .filter((p) => p.data.date || headers().get('host')?.includes('localhost'))
    .sort((a, b) => compareDesc(new Date(a.data.date), new Date(b.data.date)))

  return (
    <>
      <div data-prose="true">
        <h1>Hey, I'm Riley</h1>
        <p className="mt-6">
          I'm fascinated by the web and building delightful user experiences on it. This
          is my tiny corner where I share what I'm working on. You can find more on my{' '}
          <Anchor href="https://github.com/rileyKacmarynski" external>
            GitHub
          </Anchor>{' '}
          or hit me up at{' '}
          <Anchor external href="mailto:riley.kacmarynski@gmail.com">
            riley.kacmarynski@gmail.com
          </Anchor>
          .
        </p>
      </div>
      <div className="mt-6 gap-6 grid grid-cols-2">
        <div className="max-w-3xs">
          <h2 className="text-sm text-muted-fg mb-6">Components (coming soon!)</h2>
          <div className="relative">
            <ul hover-list="true" className="blurred space-y-6 relative opacity-50">
              {posts.slice(1, 4).map(({ data, slug }) => (
                <li className="list-none">
                  <Link href={`blog/${slug}`} className="flex flex-col gap-1 min-h-16 ">
                    <span className="font-medium text-balance">{data.title}</span>
                    <p className="text-muted-fg text-balance text-sm">
                      {data.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <div
              aria-hidden="true"
              className="absolute -inset-4 bg-transparent backdrop-blur-sm [mask-image:linear-gradient(to_bottom,transparent,black_0%)]"
            />
          </div>
        </div>
        <div className="max-w-3xs">
          <Anchor href="/blog">
            <h2 className="text-sm text-muted-fg mb-6">Blog</h2>
          </Anchor>
          <ul hover-list="true" className="space-y-6">
            {posts.slice(0, 4).map(({ data, slug }) => (
              <li className="list-none">
                <Link href={`blog/${slug}`} className="flex flex-col gap-1 min-h-16 ">
                  <span className="font-medium text-balance">{data.title}</span>
                  <p className="text-muted-fg text-balance text-sm">{data.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
