"use client";

import { useState } from "react";
import SpendingForm from "@/components/SpendingForm";
import SpendingList from "@/components/SpendingList";
import {
  loadCategories,
  loadEntries,
  mergeCategories,
  saveCategories,
  saveEntries,
} from "@/lib/storage";
import type { SpendingEntry } from "@/lib/types";

export default function SpendingTracker() {
  const [categories, setCategories] = useState<string[]>(() => loadCategories());
  const [entries, setEntries] = useState<SpendingEntry[]>(() => loadEntries());
  const [selectedCategory, setSelectedCategory] = useState("");

  function handleAddCategory(name: string): boolean {
    const trimmed = name.trim();
    if (!trimmed) return false;

    if (categories.includes(trimmed)) {
      setSelectedCategory(trimmed);
      return false;
    }

    const updated = mergeCategories([...categories, trimmed]);
    setCategories(updated);
    saveCategories(updated);
    setSelectedCategory(trimmed);
    return true;
  }

  function handleAddEntry(category: string, amount: number): boolean {
    if (!category || amount <= 0) return false;

    const entry: SpendingEntry = {
      id: crypto.randomUUID(),
      category,
      amount,
      createdAt: new Date().toISOString(),
    };

    setEntries((prev) => {
      const updated = [entry, ...prev];
      saveEntries(updated);
      return updated;
    });

    if (!selectedCategory) {
      setSelectedCategory(category);
    }

    return true;
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8 px-4 py-12 sm:px-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Spending Tracker
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Log expenses by category and review your recent spendings.
        </p>
      </header>

      <SpendingForm
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectedCategoryChange={setSelectedCategory}
        onAddCategory={handleAddCategory}
        onAddEntry={handleAddEntry}
      />

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Recent spendings
        </h2>
        <SpendingList entries={entries} />
      </section>
    </div>
  );
}
