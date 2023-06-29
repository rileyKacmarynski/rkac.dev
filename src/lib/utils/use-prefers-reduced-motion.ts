import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: no-preference)'

const getInitialState = () => !window.matchMedia(QUERY).matches

export default function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState(getInitialState)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY)
    const controller = new AbortController()

    mediaQueryList.addEventListener(
      'change',
      (e) => {
        return setPrefersReducedMotion(!e.matches)
      },
      { signal: controller.signal }
    )

    return controller.abort
  })

  return prefersReducedMotion
}
