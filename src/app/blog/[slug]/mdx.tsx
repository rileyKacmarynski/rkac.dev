// hopefully this get's fixed soon so I don't have to do this
// https://github.com/contentlayerdev/contentlayer/issues/434
'use client'
import { FancyAnchor } from '@/components/ui/fancy-anchor'
import { useMDXComponent } from 'next-contentlayer/hooks'
import Image from 'next/image'
import React from 'react'

export const mdxComponents = {
  Image,
  a: ({ href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    // don't render a fancy link for the headingings
    if (props.className?.split(' ').some((c) => c === 'heading')) {
      return <a {...props} />
    }

    return <FancyAnchor external {...props} href={href ?? ''} />
  },
  Anchor: FancyAnchor,
}

export interface MdxProps {
  code: string
}

export function Mdx({ code }: MdxProps) {
  const MDXContent = useMDXComponent(code)

  // @ts-ignore - issue with Image component
  return <MDXContent components={mdxComponents} />
}
