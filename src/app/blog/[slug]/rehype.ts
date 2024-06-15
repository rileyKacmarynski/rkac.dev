import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutoLinkHeadings from 'rehype-autolink-headings'

const options = {
  keepBackground: false,
  theme: {
    dark: 'catppuccin-mocha',
    light: 'one-light',
  },
}

export const rehypePlugins = [
  [rehypePrettyCode, options],
  rehypeSlug,
  rehypeAutoLinkHeadings,
]
