import { getPostFromParams, mapTagsToIcon } from './helpers'
import { PostProps } from './page'
import OGImage from '@/components/og-image'
import { ImageResponse } from 'next/server'

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

  return new ImageResponse(
    (
      <OGImage>
        {Icon ? (
          <Icon style={{ color: 'hsl(0, 100%, 100%, .5)' }} />
        ) : (
          'rkac.dev'
        )}
      </OGImage>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: await inter,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
