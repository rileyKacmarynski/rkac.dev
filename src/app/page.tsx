import { compareDesc, format, parseISO } from 'date-fns'
import { allPosts, Post } from 'contentlayer/generated'
import Balancer from 'react-wrap-balancer'
import Link from 'next/link'
import { MoveRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/theme-toggle'

export default function Home() {
  let posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  )

  posts = [...posts, ...posts, ...posts]

  return (
    <>
      <header className="sticky top-0 h-16 px-6 border-b backdrop-blur-sm border-border">
        <a
          className="absolute z-10 w-1 h-1 -m-1 overflow-hidden font-semibold text-center rounded opacity-0 focus:opacity-100 focus:w-auto focus:h-auto focus:overflow-visible focus:whitespace-normal focus:px-3 focus:py-2 focus:ring-1 dark:ring-white ring-zinc-900 dark:bg-background bg-background top-4 left-4"
          href="#skip-nav"
          tabIndex={0}
        >
          skip to content
        </a>
        <nav className="flex items-center h-full max-w-6xl">
          <Link href="/" className="block">
            <span className="inline-block text-3xl font-semibold tracking-tight -skew-x-6">
              rkac
            </span>
            <span className="text-xs font-light tracking-tight">.dev</span>
          </Link>
          <ThemeToggle />
        </nav>
      </header>
      <div id="skip-nav" className="scroll-m-16" tabIndex={-1} />
      <main className="max-w-6xl px-4 mx-auto mt-6">
        <div className="h-[420px] text-center grid items-center">
          <p className="">We&apos;ll put a some header content here</p>
        </div>
        <h1 className="mb-12 text-3xl font-bold tracking-tight text-center text-transparent bg-clip-text dark:from-white dark:to-neutral-400 from-black to-neutral-700 bg-gradient-to-b">
          Recent Posts
        </h1>
        <div className="flex flex-col w-full gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3">
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
                <footer className="flex items-end gap-3 transition text-muted-foreground group-hover:text-foreground">
                  <span className="ml-auto">Read more</span>
                  <MoveRight className="transition group-hover:translate-x-1" />
                </footer>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  )
}
