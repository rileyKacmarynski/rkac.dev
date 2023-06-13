import { compareDesc, format, parseISO } from 'date-fns'
import { allPosts, Post } from 'contentlayer/generated'
import Balancer from 'react-wrap-balancer'
import Link from 'next/link'
import { MoveRight } from 'lucide-react'

export default function Home() {
  let posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  )

  posts = [...posts, ...posts, ...posts]

  return (
    <main className="px-4 mx-auto mt-6">
      <h1 className="mb-12 text-3xl font-bold tracking-tight text-center text-transparent bg-clip-text dark:from-white dark:to-neutral-400 bg-gradient-to-b">
        Featured Posts
      </h1>
      <div className="flex flex-col w-full gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3">
        {posts.map((post) => (
          <article key={post._id} className="basis-full">
            <Link
              href={post.slug}
              className="flex flex-col sm:h-full h-[240px] p-6 no-underline transition border shadow group rounded-xl dark:border-neutral-800 dark:hover:bg-white/[2.5%] dark:hover:border-neutral-700 hover:cursor-pointer"
            >
              <header className="mb-4">
                {/* aaaaaahhhh, alright, do the vercel gradient white to not so white */}
                <h2 className="m-0 text-2xl font-bold tracking-tight text-transparent text-gray-900 bg-clip-text dark:from-white dark:to-neutral-200 bg-gradient-to-b ">
                  <Balancer>{post.title}</Balancer>
                </h2>
                <p className="mt-1 space-x-1 text-xs text-zinc-500 dark:text-neutral-400">
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
              <footer className="flex items-end gap-3 transition dark:text-neutral-400 dark:group-hover:text-neutral-50">
                <span className="ml-auto">Read more</span>
                <MoveRight className="transition group-hover:translate-x-1" />
              </footer>
            </Link>
          </article>
        ))}
      </div>
    </main>
  )
}
