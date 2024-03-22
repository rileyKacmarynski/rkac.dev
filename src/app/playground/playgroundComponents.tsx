// Would be cool to use MDX of something for this
import { oneLine } from 'common-tags'
import Tagger from './components/tagger'

// too lazy right now
export type PlaygroundComponentName = 'tagger'
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
]
