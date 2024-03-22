import { Metadata } from 'next'
import { PlaygroundComponentName, components } from '../playgroundComponents'
import { notFound } from 'next/navigation'

export type PostProps = {
  params: {
    slug: string
  }
}

const meta = {
  title: 'Playground',
  description: 'Playground for building, testing, and showcasing components.',
}

export const metadata: Metadata = {
  ...meta,
  openGraph: {
    ...meta,
    type: 'website',
    url: 'https://rkac.dev/playground',
  },
  twitter: {
    card: 'summary',
    ...meta,
  },
}

export type PlaygroundProps = {
  params: {
    slug: PlaygroundComponentName
  }
}

export async function generateStaticParams(): Promise<PlaygroundProps['params'][]> {
  return components.map((component) => ({
    slug: component.name,
  }))
}

export default async function PlaygroundPage({ params: { slug } }: PlaygroundProps) {
  const component = components.find((c) => c.name === slug)
  if (!component) throw notFound()

  return (
    <div className="m-auto pt-4 px-4">
      <div className="prose prose-blockquote:border-l-indigo-100 dark:prose-blockquote:border-l-indigo-900/60 lg:prose-lg prose-zinc dark:prose-invert">
        <h1>{component.title}</h1>
        <p>{component.description}</p>
      </div>
      <div className="mt-14">{component.Component}</div>
    </div>
  )
}
