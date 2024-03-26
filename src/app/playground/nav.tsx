'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PlaygroundComponent } from './playgroundComponents'
import { cn } from '@/lib/utils'

export default function Nav({ components }: { components: PlaygroundComponent[] }) {
  const pathname = usePathname().split('/').at(-1)

  return (
    <ul className="h-full p-2 basis-[220px] border-border border-r">
      {components.map((c) => (
        <li key={c.name}>
          <Link
            href={`/playground/${c.name}`}
            className={cn(
              'px-2 py-1 h-9 w-full dark:text-zinc-300 text-zinc-700 rounded-md leading-none flex items-center dark:hover:bg-zinc-50/5 hover:bg-zinc-950/5 cursor-pointer transition duration-200',
              pathname === c.name &&
                'text-zinc-900 dark:text-zinc-50 dark:bg-zinc-100/5 bg-zinc-900/5'
            )}
          >
            <span>{c.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
