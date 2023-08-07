import { Post } from 'contentlayer/generated'
import { add, format, formatDistanceToNow } from 'date-fns'
import { Clock } from 'lucide-react'

export default function PostTitle({ post }: { post: Post }) {
  return (
    <div>
      <h1 className="md:!mb-28 mb-20 [text-wrap:balance]">{post.title}</h1>
      <div className="flex gap-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center">
          {format(new Date(post.date), 'MMMM dd, yyyy')}
        </div>
        <span>{` • `}</span>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" strokeWidth={2} />
          <span>
            {formatDistanceToNow(
              add(new Date(), { minutes: post.readingTime.minutes })
            )}
          </span>
        </div>
        <div className="flex gap-2 ml-auto">
          {post.tags?.slice(0, 2).map((tag) => (
            <span
              key="tag"
              className="px-3 py-1 text-xs font-bold text-indigo-500 bg-indigo-100 rounded-full dark:bg-indigo-900/60 dark:text-indigo-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <hr className="w-full h-px !mt-6 border-0 dark:bg-zinc-700 bg-zinc-300" />
    </div>
  )
}
