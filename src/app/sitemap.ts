import { allPosts } from 'contentlayer/generated'
import { formatISO } from 'date-fns'

export default async function sitemap() {
  const posts = allPosts.map((post) => ({
    url: `https://rkac.dev/blog/${post.slug}`,
    lastModified: post.date,
  }))

  const routes = ['', '/blog'].map((route) => ({
    url: `https://rkac.dev${route}`,
    lastModified: formatISO(new Date(), { representation: 'date' }),
  }))

  return [...routes, ...posts]
}
