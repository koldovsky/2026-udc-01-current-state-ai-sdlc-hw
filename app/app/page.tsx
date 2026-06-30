import { MpgCalculator } from '@/app/components/MpgCalculator'

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center bg-white dark:bg-black">
        <MpgCalculator />
      </main>
    </div>
  )
}
