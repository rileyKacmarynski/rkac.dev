import { compareDesc, format, parseISO } from 'date-fns'
import { Post, allPosts } from 'contentlayer/generated'
import Balancer from 'react-wrap-balancer'
import Link from 'next/link'
import { MoveRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'
import GitHubIcon from '@/components/icons/github-icon'
import Header from '@/components/header'
import PostCard from '@/components/post-card'
import { headers } from 'next/headers'

export default function Home() {
  let posts = allPosts
    .filter((p) => p.published || headers().get('host')?.includes('localhost'))
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  posts = [...posts, ...posts, ...posts]

  return (
    <>
      <Header />
      <div className="px-6 pt-6 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="h-[330px] mb-16">
            <section>
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
                  I love building things on the web and hope to share what I learn here.
                </p>
              </div>
              <a
                href="https://github.com/rileyKacmarynski"
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants(), 'mt-6 gap-2')}
              >
                <GitHubIcon className="w-4 h-4" /> GitHub
              </a>
            </section>
          </div>
          <h2 className="mb-12 text-3xl font-bold tracking-tight text-transparent bg-clip-text dark:from-white dark:to-neutral-400 from-black to-neutral-700 bg-gradient-to-b">
            Recent Posts
          </h2>
          <div className="flex flex-col w-full gap-4 sm:grid sm:grid-cols-2 ">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
