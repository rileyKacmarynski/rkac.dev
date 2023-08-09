import { Post } from 'contentlayer/generated'
import { format, parseISO } from 'date-fns'
import { Link, MoveRight } from 'lucide-react'
import Balancer from 'react-wrap-balancer'

export function PostCard({ post }: { post: Post }) {
  // <motion.div className="absolute transition duration-300 bg-indigo-800 opacity-0 pointer-events-none -inset-px rounded-xl group:hover:opacity-100" />
  return (
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
  )
}

export default PostCard
