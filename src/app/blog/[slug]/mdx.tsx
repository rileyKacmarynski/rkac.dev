import { FancyAnchor } from '@/components/ui/fancy-anchor'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import React from 'react'
import rehypePrettyCode from 'rehype-pretty-code'

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

async function Code({
  children,
  ...props
}: { children: string } & Partial<Parameters<typeof codeToHtml>['1']>) {
  // console.log('props\n', children)
  let codeHTML = await codeToHtml(children, {
    lang: 'tsx',
    themes: {
      light: 'min-light',
      dark: 'min-dark',
    },
    ...props,
  })

  console.log('code html', codeHTML)

  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

function createHeading(level: number) {
  const Heading = ({ children }: { children: string }) => {
    let slug = slugify(children)
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

export const mdxComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  // eslint-disable-next-line jsx-a11y/alt-text
  Image: (props: React.ComponentProps<typeof Image>) => <Image {...props} />,
  a: ({ href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    // don't render a fancy link for the headingings
    if (props.className?.split(' ').some((c) => c === 'heading')) {
      return <a {...props} />
    }

    return <FancyAnchor external {...props} href={href ?? ''} />
  },
  Anchor: FancyAnchor,
  // code: Code,
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
          rehypePlugins: [[rehypePrettyCode, options]],
        },
      }}
    />
  )
}

const options = {
  keepBackground: false,
  theme: 'github-dark',
}
