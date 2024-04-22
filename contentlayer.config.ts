import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import readingTime from 'reading-time'
import rehypeSlug from 'rehype-slug'
import rehypAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
// @ts-ignore
import sectionize from 'remark-sectionize'
import GitHubSlugger from 'github-slugger'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string' },
    published: { type: 'boolean', required: false, default: false },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' } },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => `/${doc._raw.flattenedPath}`,
    },
    readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
    // if someone's reading this, shoutout to this dude: https://www.yusuf.fyi/posts/contentlayer-table-of-contents
    headings: {
      type: 'json',
      resolve: (doc) => {
        // we could capture the level along with content
        // if we wanted to do all headings
        // just going to do the h2's for now
        const regX = /\n#{2}\s+(?<content>.+)/g

        return Array.from(doc.body.raw.matchAll(regX)).map(([_, heading]) => ({
          heading,
          id: new GitHubSlugger().slug(heading),
        }))
      },
    },
  },
}))

export default makeSource({
  contentDirPath: './content',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm, sectionize],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: 'css-variables',
          onVisitLine(node: any) {
            // Prevent lines from collapsing in `display: grid` mode, and
            // allow empty lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }]
            }
          },
          onVisitHighlightedLine(node: any) {
            node.properties.className = ['line-highlighted']
          },
          onVisitHighlightedWord(node: any) {
            node.properties.className = ['word-highlighted']
          },
        },
      ],
      [
        rehypAutolinkHeadings,
        {
          properties: {
            className: ['heading'],
          },
        },
      ],
    ],
  },
})
