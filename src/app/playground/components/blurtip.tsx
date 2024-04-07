'use client'

import './blurtip.css'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { AtomIcon, CakeIcon, RocketIcon } from 'lucide-react'

export default function Blurtip() {
  const [opacity, setOpacity] = useState(0)
  const [blur, setBlur] = useState(10)
  const [scale, setScale] = useState(1.3)
  const [duration, setDuration] = useState(200)

  return (
    <>
      <div className="flex gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AtomIcon className="size-8" />
            </TooltipTrigger>
            <TooltipContent style={{ animationDuration: `${duration}ms` }}>
              <p>React</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <CakeIcon className="size-8" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Cake</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <RocketIcon className="size-8" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Rocket</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="space-y-6 mt-10">
        <div className="flex flex-col gap-4">
          <label htmlFor="opacity" className="text-lg">
            opacity: <b>{opacity}</b>
          </label>
          <Slider
            id="opacity"
            onValueChange={([v]) => {
              setOpacity(v)
              document.documentElement.style.setProperty(
                '--blurtip-opacity',
                v.toString()
              )
            }}
            value={[opacity]}
            min={0}
            max={1}
            step={0.1}
          />
        </div>
        <div className="flex flex-col gap-4">
          <label htmlFor="scale" className="text-lg">
            scale: <b>{scale}</b>
          </label>
          <Slider
            id="scale"
            onValueChange={([v]) => {
              setScale(v)
              document.documentElement.style.setProperty('--blurtip-scale', v.toString())
            }}
            value={[scale]}
            min={0}
            max={10}
            step={0.25}
          />
        </div>
        <div className="flex flex-col gap-4">
          <label htmlFor="blur" className="text-lg">
            blur: <b>{blur}</b>
          </label>
          <Slider
            id="blur"
            onValueChange={([v]) => {
              setBlur(v)
              document.documentElement.style.setProperty('--blurtip-blur', `${v}px`)
            }}
            value={[blur]}
            min={0}
            max={50}
            step={2}
          />
        </div>
      </div>
    </>
  )
}

import { cn } from '@/lib/utils'
import { forwardRef, useState } from 'react'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden font-regular dark:text-zinc-200 text-zinc-800 animate-[blur-in_300ms_ease-out] data-[state=closed]:animate-[blur-out_300ms_ease-out]',
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

import * as SliderPrimitive from '@radix-ui/react-slider'

const Slider = forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none select-none items-center', className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-zinc-300" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-zinc-300 bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
