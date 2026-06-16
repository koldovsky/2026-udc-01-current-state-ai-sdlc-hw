import EvenOddChecker from '@/components/EvenOddChecker'
import CharacterCounter from '@/components/CharacterCounter'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-wrap items-center justify-center gap-6 bg-zinc-50 p-4 dark:bg-black">
      <EvenOddChecker />
      <CharacterCounter />
    </div>
  )
}
