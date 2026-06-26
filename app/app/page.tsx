import SpendingTracker from "@/components/SpendingTracker";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 flex-col">
        <SpendingTracker />
      </main>
    </div>
  );
}
