import { getBlogPosts } from '@/app/blog/utils'
import { formatISO } from 'date-fns'

export default async function sitemap() {
  const posts = getBlogPosts().map((post) => ({
    url: `https://rkac.dev/blog/${post.slug}`,
    lastModified: post.data.date,
  }))

  const routes = ['', '/blog'].map((route) => ({
    url: `https://rkac.dev${route}`,
    lastModified: formatISO(new Date(), { representation: 'date' }),
  }))

  return [...routes, ...posts]
}
