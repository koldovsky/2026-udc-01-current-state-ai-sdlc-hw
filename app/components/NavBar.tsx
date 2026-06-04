"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/robots", label: "Catalog" },
  { href: "/about", label: "About" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href="/robots"
          className="text-sm font-semibold text-zinc-900 dark:text-zinc-50"
        >
          Robot Catalog
        </Link>
        <div className="flex gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors ${
                pathname.startsWith(l.href)
                  ? "font-semibold text-zinc-900 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
