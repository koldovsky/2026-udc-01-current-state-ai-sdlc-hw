import type { Metadata } from "next";
import Counter from "@/app/components/Counter";

export const metadata: Metadata = {
  title: "Counter",
  description: "A small counter feature built for UDC Workshop 1.",
};

export default function CounterPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 bg-zinc-50 px-6 py-24 dark:bg-black">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Counter
      </h1>
      <Counter />
    </main>
  );
}
