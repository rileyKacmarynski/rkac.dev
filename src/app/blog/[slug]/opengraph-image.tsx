import { Post } from 'contentlayer/generated'
import { getPostFromParams } from './helpers'
import { PostProps } from './page'
import OGImage from '@/components/og-image'
import { ImageResponse } from 'next/server'
import NextJSIcon from '@/components/icons/nextjs-icon'
import ReactIcon from '@/components/icons/react-icon'
import JavascriptIcon from '@/components/icons/javascript-icon'
import TypescriptIcon from '@/components/icons/typescript-icon'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'rkac.dev blog'
export const contentType = 'image/png'
export const size = {
  width: 1200,
  height: 630,
}

// https://github.com/vercel/next.js/issues/48081
// Font has to be inside route handler I guess?

export default async function Image({ params }: PostProps) {
  const inter = fetch(
    new URL('/public/Inter-Regular.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())

  const post = await getPostFromParams(params)
  const Icon = mapTagsToIcon(post?.tags ?? [])

  return new ImageResponse(<OGImage>{Icon ? Icon : 'rkac.dev'}</OGImage>, {
    ...size,
    fonts: [
      {
        name: 'Inter',
        data: await inter,
        style: 'normal',
        weight: 400,
      },
    ],
  })
}

function mapTagsToIcon(tags: Post['tags']) {
  if (!tags || !tags.length) {
    return null
  }

  // not a huge fan of this
  // already making typos between here and the frontmatter
  for (const tag of tags) {
    switch (tag) {
      case 'Next.js':
        return <NextJSIcon />
      case 'React':
        return (
          <ReactIcon
            style={{
              height: '320px',
              width: '320px',
              color: 'hsl(0, 100%, 100%, .25)',
            }}
          />
        )
      case 'JavaScript':
        return (
          <JavascriptIcon
            style={{
              height: '320px',
              width: '320px',
              color: 'hsl(0, 100%, 100%, .25)',
            }}
          />
        )
      case 'TypeScript':
        return (
          <TypescriptIcon
            style={{
              height: '320px',
              width: '320px',
              color: 'hsl(0, 100%, 100%, .25)',
            }}
          />
        )
      default:
        return null
    }
  }
}
