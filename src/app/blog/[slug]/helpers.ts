import { PostProps } from '@/app/blog/[slug]/page'
import JavascriptIcon from '@/components/icons/javascript-icon'
import NextJSIcon from '@/components/icons/nextjs-icon'
import ReactIcon from '@/components/icons/react-icon'
import TypescriptIcon from '@/components/icons/typescript-icon'
import { Post, allPosts } from 'contentlayer/generated'

export async function getPostFromParams(params: PostProps['params']) {
  return allPosts.find(
    (post) => post.slug.split('/').slice(-1)[0] === params?.slug
  )
}

export function mapTagsToIcon(tags: Post['tags']) {
  if (!tags || !tags.length) {
    return null
  }

  // not a huge fan of this
  // already making typos between here and the frontmatter
  for (const tag of tags) {
    switch (tag) {
      case 'Next.js':
        return NextJSIcon
      case 'React':
        return ReactIcon
      case 'JavaScript':
        return JavascriptIcon
      case 'TypeScript':
        return TypescriptIcon
      default:
        return null
    }
  }
}
