import type { Post } from '@/app/blog/utils'
import { add, format, formatDistanceToNow } from 'date-fns'
import { Clock } from 'lucide-react'

export default function PostTitle({ post }: { post: Post }) {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between">
        <h1>{post.data.title}</h1>
        <div className="flex gap-2 items-center text-sm font-semibold dark:text-mauve-9">
          <time dateTime={post.data.date.toLocaleDateString()}>
            {format(new Date(post.data.date), 'MMMM dd, yyyy')}
          </time>
          <span>{` • `}</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 mt-[2px]" strokeWidth={2} />
            <span>
              {formatDistanceToNow(
                add(new Date(), { minutes: post.data.readingTime.minutes })
              )}
            </span>
          </div>
        </div>
      </div>
      <hr className="w-full h-px !mt-0_5 border-0 dark:bg-zinc-700 bg-zinc-300" />
    </>
  )
}
