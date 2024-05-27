import { notFound } from 'next/navigation'
import PostTitle from '@/app/blog/[slug]/post-title'
import { Mdx } from '@/app/blog/[slug]/mdx'
import { Metadata } from 'next'
import MobileProgress from './mobile-progress'
import Header from '@/components/header'
import { TableOfContents } from '@/app/blog/[slug]/table-of-contents'
import { headers } from 'next/headers'
import { getBlogPosts, getPostFromSlug } from '@/app/blog/utils'

export type PostProps = {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata | undefined> {
  const post = getPostFromSlug(params.slug)
  if (!post) {
    return
  }

  const { slug, data } = post

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      type: 'article',
      publishedTime: data.date.toLocaleString(),
      url: `https://rkac.dev/blog/${slug}`,
    },
    twitter: {
      card: 'summary',
      title: data.title,
      description: data.description,
    },
  }
}

export async function generateStaticParams(): Promise<PostProps['params'][]> {
  return getBlogPosts().map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({ params }: PostProps) {
  const post = getPostFromSlug(params.slug)

  if (!post) return notFound()
  if (!post.data.published && !headers().get('host')?.includes('localhost'))
    return notFound()

  return (
    <>
      <Header>
        <MobileProgress />
      </Header>
      {/* <div className="px-6 pt-6 mt-16">
        {post?.headings.length ? <TableOfContents headings={post.headings} /> : undefined}{' '}
      </div>{' '} */}
      <div className="max-w-4xl px-4 py-6 mx-auto">
        <article className="py-20 mx-auto prose prose-blockquote:border-l-indigo-100 dark:prose-blockquote:border-l-indigo-900/60 lg:prose-lg prose-zinc dark:prose-invert">
          <PostTitle post={post} />
          <Mdx source={post.content} />
        </article>
      </div>
    </>
  )
}
