import { PostProps } from '@/app/blog/[slug]/page'
import { allPosts } from 'contentlayer/generated'

export default async function getPostFromParams(params: PostProps['params']) {
  return allPosts.find(
    (post) => post.slug.split('/').slice(-1)[0] === params?.slug
  )
}
