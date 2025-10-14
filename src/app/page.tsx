import { compareDesc } from 'date-fns'
import Link from 'next/link'
import { headers } from 'next/headers'
import { getBlogPosts } from '@/app/blog/utils'
import { Anchor } from '@/components/ui/Anchor'
import Header from '@/components/header'

const experiments = [
  {
    title: 'PGLite',
    description:
      "PGLite is a WASM Postgres build packaged into a Typescript library. Let's see what we can do with it.",
    slug: 'pglite',
  },
  {
    title: 'Runs',
    description: 'A page for visualizing runs and progress. Come see how slow I am.',
    slug: 'runs',
  },
]

export default function Home() {
  let posts = getBlogPosts()
    .filter((p) => p.data.published || headers().get('host')?.includes('localhost'))
    .sort((a, b) => compareDesc(new Date(a.data.date), new Date(b.data.date)))

  return (
    <>
      <Header />
      <div className="px-3 pt-20 pb-6 mx-auto max-w-2xl">
        <div data-prose="true">
          <h1 data-fadeIn="true">Hey, I'm Riley</h1>
          <p data-fadeIn="true" className="mt-6 [--stagger:1]">
            I've been building stuff on the web for around 10 years. Much of that time has been spent building web applications and APIs hosted in AWS. I enjoy developing at every level of the stack whether it's building a slick UI or spinning up cloud infrastructure. This site is my corner of the internet where I play around with tech that excites me.
          </p>
          <p data-fadeIn="true" className="[--stagger:1]">
            You can find more on my{' '}
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
        <div className="mt-12 gap-12 grid sm:grid-cols-2 grid-cols-1">
          <div data-fadeIn="true" className="max-w-4xs [--stagger:2]">
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
          <div data-fadeIn="true" className="max-w-4xs sm:ml-auto no-blur [--stagger:3]">
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
        </div>
      </div>
    </>
  )
}
