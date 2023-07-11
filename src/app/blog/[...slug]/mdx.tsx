import { useMDXComponent } from 'next-contentlayer/hooks'
import Image from 'next/image'

export const mdxComponents = {
  Image,
}

export interface MdxProps {
  code: string
}

export function Mdx({ code }: MdxProps) {
  const MDXContent = useMDXComponent(code)

  // @ts-ignore - issue with Image component
  return <MDXContent components={mdxComponents} />
}
