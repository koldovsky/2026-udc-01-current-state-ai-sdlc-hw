import FinanceTracker from "./components/finance-tracker";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center bg-zinc-50 dark:bg-zinc-900 min-h-screen">
      <FinanceTracker />
    </main>
  );
}
