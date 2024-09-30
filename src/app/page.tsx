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
    .filter((p) => p.data.date || headers().get('host')?.includes('localhost'))
    .sort((a, b) => compareDesc(new Date(a.data.date), new Date(b.data.date)))

  return (
    <>
      <Header />
      <div className="px-3 pt-20 pb-6 mx-auto max-w-2xl">
        <div data-prose="true">
          <h1 data-fadeIn="true">Hey, I'm Riley</h1>
          <p data-fadeIn="true" className="mt-6 [--stagger:1]">
            I've spent the last 7 years as a full-stack web developer, but my passions
            have me leaning more towards the front-end. I love crafting smooth, engaging
            experiences that make interacting with my websites a joy for users. This is my
            small corner of the internet where I share what I'm learning.
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
        <div className="mt-12 gap-12 grid grid-cols-2">
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
          <div data-fadeIn="true" className="max-w-4xs ml-auto no-blur [--stagger:3]">
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
        <div className="mt-20">
          <h2 className="text-heading-fg font-medium mb-2 text-lg" id="now">
            What I'm up to
          </h2>
          <p className="">
            Trying to take advantage of fall before the hash South Dakota winter arrives.
          </p>
          <h3 className="font-medium text-muted-fg mt-6 mb-3">Learning</h3>
          <p>
            I've been spending more time digging into data on the client. Following the
            local-first movement and reading about how{' '}
            <Anchor external href="https://www.instantdb.com/essays/db_browser">
              many of the problems we wrestle with on the front-end are actually database
              problems in a trenchcoat
            </Anchor>{' '}
            is changing the way I think about building web applications.
          </p>
          <h3 className="font-medium text-muted-fg mt-6 mb-3">Reading</h3>
          <p>
            I've recently picked up{' '}
            <Anchor
              external
              href="https://www.amazon.com/dp/173210221X?ref=ppx_yo2ov_dt_b_fed_asin_title"
            >
              A Philosophy of Software Design
            </Anchor>
            . So far I'm enjoying it, but there's nothing revolutionary. I've been
            reaching some of the same conclusions about deep modules and simple interfaces
            and hearing it somewhere else does wonders to my ego.
          </p>
          <h3 className="font-medium text-muted-fg mt-6 mb-3">Fitness</h3>
          <p>
            Been really focused on running lately. I'm not fast, nor do I run particularly
            long distances, but if you're curious check out{' '}
            <Anchor href="/runs">runs</Anchor>.
          </p>
        </div>
      </div>
    </>
  )
}
