import { Post } from 'contentlayer/generated'
import { add, format, formatDistanceToNow } from 'date-fns'
import { Clock } from 'lucide-react'

export default function PostTitle({ post }: { post: Post }) {
  return (
    <div className="mb-12">
      <h1 className="mb-8">{post.title}</h1>
      <div className="flex gap-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        <span>{format(new Date(post.date), 'MMMM dd, yyyy')}</span>
        {/* <span>{` • `}</span> */}
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3" strokeWidth={2} />
          <span>
            {formatDistanceToNow(
              add(new Date(), { minutes: post.readingTime.minutes })
            )}
          </span>
        </div>
      </div>
      <hr className="w-full h-px mt-6 border-0 dark:bg-zinc-700 bg-zinc-300" />
    </div>
  )
}
