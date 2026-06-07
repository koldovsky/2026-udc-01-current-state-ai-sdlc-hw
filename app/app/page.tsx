import FeedbackForm from "@/app/components/feedback-form";

export default function Home() {
  return (
    <div className="flex flex-1 items-start justify-center bg-zinc-50 py-16 dark:bg-black">
      <div className="w-full max-w-xl px-6">
        <div className="mb-10 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Marketing Research Survey
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Help us understand your experience. This takes about 2 minutes.
          </p>
        </div>
        <FeedbackForm />
      </div>
    </div>
  );
}
