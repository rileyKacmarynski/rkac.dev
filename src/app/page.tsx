import { compareDesc } from 'date-fns'
import Link from 'next/link'
import { headers } from 'next/headers'
import { getBlogPosts } from '@/app/blog/utils'
import { Anchor } from '@/components/ui/Anchor'
import Header from '@/components/header'

const experiments = [
  { title: 'PGLite', description: 'Postgres, WASM in the browser.', slug: 'pglite' },
  { title: 'Runs', description: 'Come see how slow I am.', slug: 'runs' },
]

export default function Home() {
  let posts = getBlogPosts()
    .filter((p) => p.data.date || headers().get('host')?.includes('localhost'))
    .sort((a, b) => compareDesc(new Date(a.data.date), new Date(b.data.date)))

  return (
    <>
      <Header />
      <div className="px-3 pt-20 pb-6 mx-auto max-w-2xl">
        <div data-prose="true">
          <h1 data-fadeIn="true">Hey, I'm Riley</h1>
          <p data-fadeIn="true" className="mt-6 [--stagger:1]">
            I'm fascinated by the web and building delightful user experiences on it. This
            is my tiny corner of the internet where I share what I'm working on. You can
            find more on my{' '}
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
        <div className="mt-12 gap-6 grid grid-cols-2">
          <div data-fadeIn="true" className="max-w-3xs [--stagger:2]">
            <h2 className="text-sm text-muted-fg mb-6">Practice</h2>
            <ul hover-list="true" className="space-y-6">
              {experiments.map(({ title, description, slug }) => (
                <li className="list-none">
                  <Link href={`${slug}`} className="flex flex-col gap-1 min-h-16 ">
                    <span className="font-medium text-balance">{title}</span>
                    <p className="text-muted-fg text-balance text-sm">{description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div data-fadeIn="true" className="max-w-3xs ml-auto no-blur [--stagger:3]">
            <Anchor href="#">
              <h2 className="text-sm text-muted-fg mb-6 text-balance">Blog</h2>
            </Anchor>
            <div>
              <ul hover-list="true" className="space-y-6">
                {posts.slice(0, 4).map(({ data, slug }) => (
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
            </div>
          </div>
          {/* <div>
            <h2 className="font-medium" id="now">
              /Now
            </h2>
          </div> */}
        </div>
      </div>
    </>
  )
}
