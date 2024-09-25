import { notFound } from 'next/navigation'
import PostTitle from '@/app/blog/[slug]/post-title'
import { Mdx } from '@/app/blog/[slug]/mdx'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { getBlogPosts, getPostFromSlug } from '@/app/blog/utils'
import { PostLink } from '@/app/blog/[slug]/post-link'

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
      <nav className="whitespace-nowrap top-20 sticky" style={{ gridColumn: 1 }}>
        <PostLink />
      </nav>
      <div data-prose="true">
        <PostTitle post={post} />
        <Mdx source={post.content} />
      </div>
    </>
  )
}
