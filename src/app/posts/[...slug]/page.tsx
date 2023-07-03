import { notFound } from 'next/navigation'
import { allPosts } from 'contentlayer/generated'
import { Metadata } from 'next'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { useMDXComponent } from 'next-contentlayer/hooks'
import Image from 'next/image'

type PostProps = {
  params: {
    slug: string[]
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
    <article className="py-6 prose dark:prose-invert">
      <Mdx code={post.body.code} />
    </article>
  )
}

const mdxComponents = {
  Image,
}

function Mdx({ code }: { code: string }) {
  const Component = useMDXComponent(code)

  // @ts-ignore
  return <Component components={mdxComponents} />
}
