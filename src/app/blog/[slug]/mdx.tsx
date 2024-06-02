import { rehypePlugins } from '@/app/blog/[slug]/rehype'
import { FancyAnchor } from '@/components/ui/fancy-anchor'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import React from 'react'

function Table({ data }: { data: any }) {
  let headers = data.headers.map((header: any, index: any) => (
    <th key={index}>{header}</th>
  ))
  let rows = data.rows.map((row: any, index: any) => (
    <tr key={index}>
      {row.map((cell: any, cellIndex: any) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

export const mdxComponents = {
  // eslint-disable-next-line jsx-a11y/alt-text
  Image: (props: React.ComponentProps<typeof Image>) => <Image {...props} />,
  a: ({ href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    return <FancyAnchor {...props} href={href ?? ''} />
  },
  ExternalLink: ({ href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <FancyAnchor href={href ?? ''} {...props} external />
  ),
  Table,
}

export function Mdx(props: MDXRemoteProps) {
  return (
    <MDXRemote
      {...props}
      // @ts-ignore
      components={{
        ...mdxComponents,
        ...(props.components || {}),
      }}
      options={{
        mdxOptions: {
          // @ts-ignore
          rehypePlugins,
        },
      }}
    />
  )
}
