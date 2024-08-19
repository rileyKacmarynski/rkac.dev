import Header from '@/components/header'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <article className="mx-auto px-6 pt-20 pb-6 max-w-5xl" layout-grid="true">
        {children}
      </article>
    </>
  )
}
