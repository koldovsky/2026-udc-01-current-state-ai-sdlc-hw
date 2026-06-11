import Calculator from "@/components/Calculator";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#d0ff00] font-sans text-neutral-900">
      <header className="border-b-2 border-neutral-900 px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight">
          graphing calculator
        </h1>
        <p className="font-mono text-sm text-neutral-800">
          type a function of <code>x</code> — e.g. <code>sin(x) + 0.5*x^2</code>
        </p>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-6">
        <Calculator />
      </main>
      <footer className="border-t-2 border-neutral-900 px-6 py-2 font-mono text-xs text-neutral-800">
        WS01 · Next.js 16 · canvas + mathjs
      </footer>
    </div>
  );
}
