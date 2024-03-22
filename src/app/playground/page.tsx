import { redirect } from 'next/navigation'

export default async function PostPage() {
  return redirect('/playground/tagger')
}
