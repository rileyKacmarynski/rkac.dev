import Header from '@/components/header'
import { components } from './playgroundComponents'
import Nav from './nav'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh ">
      <Header />
      <div className="pt-16 h-full m-auto">
        <div className="h-full flex gap-4">
          <Nav components={components} />
          <section>{children}</section>
        </div>
      </div>
    </div>
  )
}
