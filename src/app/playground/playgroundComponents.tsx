// Would be cool to use MDX of something for this
import { oneLine } from 'common-tags'
import Tagger from './components/tagger'
import ElasticButton from './components/elastic-button'
import Blurtip from './components/blurtip'

// too lazy right now
export type PlaygroundComponentName = 'tagger' | 'elastic-button' | 'blurtip'
export type PlaygroundComponent = {
  name: PlaygroundComponentName
  title: string
  description: string
  Component: React.ReactNode
}

export const components: PlaygroundComponent[] = [
  {
    name: 'tagger',
    title: 'Tagger',
    Component: <Tagger />,
    description: oneLine`
      I wanted to display a dynamic list of links as an inline list of tag elements. 
      The user creates a resource, some processing would happen, and then the user would be
      able to navigate to the resource. This component handles the dynamic list of resources and
      a loading indicator while the resource is processing.
    `,
  },
  {
    name: 'elastic-button',
    title: 'Elastic Button',
    Component: <ElasticButton />,
    description: oneLine`
      A button copmonent that animates its size based on its content.
    `,
  },
  {
    name: 'blurtip',
    title: 'Blurtip',
    description: oneLine`
      I've been seeing examples of blurring content as it fades out.
      Is it really as easy as applying a filter to the element? Yes it is!.
      Challenge: try to keep the opacity at 1 and use blur and scale to create
      a seamless effect.
    `,
    Component: <Blurtip />,
  },
]
