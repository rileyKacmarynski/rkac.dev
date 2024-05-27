import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { z } from 'zod'

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath: string) {
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return matter(rawContent)
}

const PostSchema = z.object({
  content: z.string(),
  slug: z.string(),
  data: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    published: z.boolean().default(true),
    tags: z.string().array().default([]),
    readingTime: z.object({
      text: z.string(),
      minutes: z.number(),
      time: z.number(),
      words: z.number(),
    }),
  }),
})
export type Post = z.infer<typeof PostSchema>

function getMDXData(dir: string) {
  let mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    const parsedMdx = readMDXFile(path.join(dir, file))
    const post = {
      slug: path.basename(file, path.extname(file)),
      ...parsedMdx,
      data: {
        ...parsedMdx.data,
        readingTime: readingTime(parsedMdx.content),
      },
    }

    return PostSchema.parse(post)
  })
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), 'src', 'app', 'blog', 'posts'))
}

export function getPostFromSlug(slug: string) {
  return getBlogPosts().find((post) => post.slug === slug)
}
