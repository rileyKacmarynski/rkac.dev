import { compareDesc, format, parseISO } from 'date-fns'
import { allPosts } from 'contentlayer/generated'
import Balancer from 'react-wrap-balancer'
import Link from 'next/link'
import { MoveRight } from 'lucide-react'
import ThemeToggle from '@/components/theme-toggle'

export default function Home() {
  let posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  )

  posts = [...posts, ...posts, ...posts]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="h-[330px] ">
        <section className="">
          <h1 className="text-2xl font-bold tracking-tight mt-14">
            Hey! I&apos;m Riley 👋
          </h1>
          <div className="mt-4 prose prose-zinc dark:prose-invert">
            <p>
              {` I'm a software developer, from South Dakota. While I've filled the
              role of a fullstack developer in most of my day-to-day career, the
              last few years I've been focusing on front-end development with
              React and Typescript.`}
            </p>
            <p>
              I love building things on the web and hope to share what I learn
              here.
            </p>
          </div>
        </section>
      </div>
      <h2 className="mb-12 text-3xl font-bold tracking-tight text-center text-transparent bg-clip-text dark:from-white dark:to-neutral-400 from-black to-neutral-700 bg-gradient-to-b">
        Recent Posts
      </h2>
      <div className="flex flex-col w-full gap-4 sm:grid sm:grid-cols-2 ">
        {posts.map((post) => (
          <article key={post._id} className="basis-full">
            <Link
              href={post.slug}
              className="flex flex-col sm:h-full h-[240px] p-6 no-underline transition border shadow group rounded-xl border-border dark:hover:bg-white/[2.5%] dark:hover:border-zinc-700 hover:bg-black/[5%] hover:border-zinc-300 hover:cursor-pointer"
            >
              <header className="mb-4">
                <h2 className="m-0 text-2xl font-bold tracking-tight text-transparent text-gray-900 bg-clip-text dark:from-white dark:to-neutral-200 from-black to-neutral-800 bg-gradient-to-b ">
                  <Balancer>{post.title}</Balancer>
                </h2>
                <p className="mt-1 space-x-1 text-xs text-muted-foreground">
                  <span>{format(parseISO(post.date), 'MMMM dd, yyyy')}</span>
                  <span>{` • `}</span>
                  <span>{post.readingTime.text}</span>
                </p>
              </header>
              {post.description && (
                <p className="mt-auto mb-6 font-normal max-h-32 line-clamp-2 sm:line-clamp-4">
                  {post.description}
                </p>
              )}
              <footer className="flex items-center gap-3 transition text-muted-foreground group-hover:text-foreground">
                <span className="ml-auto">Read more</span>
                <MoveRight className="mt-[4px] transition group-hover:translate-x-1" />
              </footer>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
