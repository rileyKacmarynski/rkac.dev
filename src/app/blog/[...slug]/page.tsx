import { notFound } from 'next/navigation'
import { allPosts } from 'contentlayer/generated'
import PostTitle from '@/app/blog/[...slug]/post-title'
import { Mdx } from '@/app/blog/[...slug]/mdx'
import { Metadata } from 'next'

type PostProps = {
  params: {
    slug: string[]
  }
}

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata | undefined> {
  const post = await getPostFromParams(params)
  if (!post) {
    return
  }

  const { title, description, date: publishedTime, slug } = post

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `https://rkac.dev/blog/${slug}`,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

async function getPostFromParams(params: PostProps['params']) {
  const slug = params?.slug?.join('/')
  return allPosts.find((post) => post.slugAsParams === slug)
}

export async function generateStaticParams(): Promise<PostProps['params'][]> {
  return allPosts.map((post) => ({
    slug: post.slugAsParams.split('/'),
  }))
}

export default async function PostPage({ params }: PostProps) {
  const post = await getPostFromParams(params)

  if (!post) return notFound()

  return (
    <div className="max-w-4xl py-6 mx-auto">
      <article className="py-6 mx-auto prose lg:prose-lg prose-zinc dark:prose-invert">
        <PostTitle post={post} />
        <Mdx code={post.body.code} />
      </article>
    </div>
  )
}
