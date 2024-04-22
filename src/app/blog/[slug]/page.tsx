import { notFound } from 'next/navigation'
import PostTitle from '@/app/blog/[slug]/post-title'
import { Mdx } from '@/app/blog/[slug]/mdx'
import { Metadata } from 'next'
import { getPostFromParams } from './helpers'
import { allPosts } from 'contentlayer/generated'
import MobileProgress from './mobile-progress'
import Header from '@/components/header'
import { TableOfContents } from '@/app/blog/[slug]/table-of-contents'
import { headers } from 'next/headers'

export type PostProps = {
  params: {
    slug: string
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

export async function generateStaticParams(): Promise<PostProps['params'][]> {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({ params }: PostProps) {
  const post = await getPostFromParams(params)

  if (!post) return notFound()
  if (!post.published && !headers().get('host')?.includes('localhost')) return notFound()

  return (
    <>
      <Header>
        <MobileProgress />
      </Header>
      <div className="px-6 pt-6 mt-16">
        {post?.headings.length ? <TableOfContents headings={post.headings} /> : undefined}{' '}
      </div>{' '}
      <div className="max-w-4xl px-4 py-6 mx-auto">
        <article className="py-6 mx-auto prose prose-blockquote:border-l-indigo-100 dark:prose-blockquote:border-l-indigo-900/60 lg:prose-lg prose-zinc dark:prose-invert">
          <PostTitle post={post} />
          <Mdx code={post.body.code} />
        </article>
      </div>
    </>
  )
}
