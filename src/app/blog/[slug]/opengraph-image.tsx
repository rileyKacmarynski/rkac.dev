import getPostFromParams from '@/app/blog/[slug]/getPostFromParams'
import { PostProps } from '@/app/blog/[slug]/page'
import { ImageResponse } from 'next/server'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'rkac.dev blog'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// https://github.com/vercel/next.js/issues/48081
// Font has to be inside route handler I guess?

// Image generation
export default async function Image({ params }: PostProps) {
  const interSemiBold = fetch(
    new URL('/public/Inter-Regular.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())

  const post = await getPostFromParams(params)

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post ? post.title : 'rkac.dev blog'}
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: await interSemiBold,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
