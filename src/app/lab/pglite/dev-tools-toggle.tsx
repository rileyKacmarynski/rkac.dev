import { CodeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import React from 'react'

export default function DevToolToggle(props: React.ComponentProps<'button'>) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="mr-auto" size="icon" variant="ghost" {...props}>
            <CodeIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle dev tools</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
