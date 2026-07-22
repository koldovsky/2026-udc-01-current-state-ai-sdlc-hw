import { SubscriptionPlans } from "@/components/SubscriptionPlans";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-col items-start py-16 px-8 bg-white dark:bg-black sm:py-24 sm:px-12">
        <SubscriptionPlans />
      </main>
    </div>
  );
}
