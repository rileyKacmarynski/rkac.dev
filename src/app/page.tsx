import { compareDesc, format, parseISO } from 'date-fns'
import { allPosts, Post } from 'contentlayer/generated'
import Link from 'next/link'

export default function Home() {
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  )

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <h1 className="text-2xl text-center">Posts</h1>
      {posts.map((post) => (
        <div key={post._id} className="mb-8">
          <h2 className="mb-2 text-xl">
            <Link
              href={post.slug}
              className="text-blue-700 hover:text-blue-900 dar:text-blue-400"
            >
              {post.title}
            </Link>
          </h2>
          <time dateTime={post.date} className="mb-2 text-xs text-gray-600">
            {format(parseISO(post.date), 'LLLL, d, yyyy')}
          </time>
          <div
            className="text-sm [&>*]:mb-3 [&>*:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: post.body.raw }}
          ></div>
        </div>
      ))}
    </main>
  )
}
