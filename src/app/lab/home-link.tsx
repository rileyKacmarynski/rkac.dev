import { Anchor } from '@/components/ui/Anchor'
import { ArrowLeftIcon } from 'lucide-react'

export default function HomeLink() {
  return (
    <Anchor className="inline-flex group gap-0.5 items-center" href="/">
      <ArrowLeftIcon className="w-4 h-4 stroke-muted-bg group-hover:stroke-hover duration-200" />
      Home
    </Anchor>
  )
}
