export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto max-w-2xl px-6 py-16">

        {/* Author */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-2xl font-bold text-white dark:bg-zinc-50 dark:text-zinc-900">
              S
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Spike_Doc</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Creator & Robot Designer</p>
            </div>
          </div>
          <p className="mt-5 leading-7 text-zinc-700 dark:text-zinc-300">
            3D printing enthusiast and robotics hobbyist designing LEGO Spike-compatible builds
            for makers of all skill levels. Every robot on this catalog is fully open-source —
            print the parts, follow the steps, and build something that moves.
            Based in Europe and sharing designs freely on MakerWorld since 2023.
          </p>
        </section>

        {/* Contact */}
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Get in touch</h2>

          <div className="space-y-3">
            <ContactRow label="Email">
              <a
                href="mailto:spike.doc@makerworld.com"
                className="text-zinc-900 hover:underline dark:text-zinc-50"
              >
                spike.doc@makerworld.com
              </a>
            </ContactRow>

            <ContactRow label="Phone">
              <a
                href="tel:+15550123456"
                className="text-zinc-900 hover:underline dark:text-zinc-50"
              >
                +1 (555) 012-3456
              </a>
            </ContactRow>

            <ContactRow label="MakerWorld">
              <a
                href="https://makerworld.com/en/@Spike_Doc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-900 hover:underline dark:text-zinc-50"
              >
                makerworld.com/@Spike_Doc
              </a>
            </ContactRow>

            <ContactRow label="GitHub">
              <a
                href="https://github.com/spike-doc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-900 hover:underline dark:text-zinc-50"
              >
                github.com/spike-doc
              </a>
            </ContactRow>

            <ContactRow label="Response time">
              <span className="text-zinc-700 dark:text-zinc-300">Usually within 48 hours</span>
            </ContactRow>
          </div>
        </section>

      </main>
    </div>
  );
}

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-4 rounded-lg border border-zinc-200 bg-white px-5 py-3.5 dark:border-zinc-800 dark:bg-zinc-900">
      <span className="w-28 shrink-0 text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-sm font-medium">{children}</span>
    </div>
  );
}
