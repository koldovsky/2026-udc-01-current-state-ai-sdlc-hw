import { SubscriptionPlans } from "@/components/SubscriptionPlans";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-lg rounded-2xl border border-black/[.08] bg-white p-8 dark:border-white/[.145] dark:bg-black">
        <SubscriptionPlans />
      </main>
    </div>
  );
}
