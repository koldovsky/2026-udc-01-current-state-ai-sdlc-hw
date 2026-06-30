import SignupForm from "./components/SignupForm";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-zinc-50 px-4 py-16 font-sans dark:bg-black">
      <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
        UDC WS1 — form with validation
      </h1>
      <SignupForm />
    </div>
  );
}
