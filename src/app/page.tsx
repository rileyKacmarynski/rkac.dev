import { compareDesc, format, parseISO } from 'date-fns'
import Balancer from 'react-wrap-balancer'
import Link from 'next/link'
import { MoveRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'
import GitHubIcon from '@/components/icons/github-icon'
import Header from '@/components/header'
import PostCard from '@/components/post-card'
import { headers } from 'next/headers'
import { getBlogPosts } from '@/app/blog/utils'

export default function Home() {
  let posts = getBlogPosts()
    .filter((p) => p.data.date || headers().get('host')?.includes('localhost'))
    .sort((a, b) => compareDesc(new Date(a.data.date), new Date(b.data.date)))

  posts = [...posts, ...posts, ...posts]

  return
}
