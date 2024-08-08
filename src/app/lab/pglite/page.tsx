'use client'

import { PostLink } from '@/app/blog/[slug]/post-link'
import HomeLink from '@/app/lab/home-link'

export default function Page() {
  return (
    <>
      <nav className="whitespace-nowrap top-20 sticky" style={{ gridColumn: 1 }}>
        <HomeLink />
      </nav>
      <section data-prose="true">
        <h1>PGLite</h1>
        <p>
          PGLite is a WASM Postgres build packaged into a Typescript library by the folks
          at Electric SQL and Neon. Let's see what we can do with it.
        </p>
      </section>
      <div></div>
    </>
  )
}
