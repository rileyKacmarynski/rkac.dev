import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutoLinkHeadings from 'rehype-autolink-headings'

const options = {
  keepBackground: false,
  theme: 'github-dark',
}

export const rehypePlugins = [
  [rehypePrettyCode, options],
  rehypeSlug,
  rehypeAutoLinkHeadings,
]
