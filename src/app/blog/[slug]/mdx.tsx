import { FancyAnchor } from '@/components/ui/fancy-anhor'
import { useMDXComponent } from 'next-contentlayer/hooks'
import Image from 'next/image'
import React from 'react'

export const mdxComponents = {
  Image,
  a: ({ href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <FancyAnchor external {...props} href={href ?? ''} />
  ),
}

export interface MdxProps {
  code: string
}

export function Mdx({ code }: MdxProps) {
  const MDXContent = useMDXComponent(code)

  // @ts-ignore - issue with Image component
  return <MDXContent components={mdxComponents} />
}
