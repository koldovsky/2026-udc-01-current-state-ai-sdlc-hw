import { DEFAULT_CATEGORIES } from "@/lib/categories";
import type { SpendingEntry } from "@/lib/types";

const STORAGE_VERSION = "v1";
const CATEGORIES_KEY = `spending-tracker:${STORAGE_VERSION}:categories`;
const ENTRIES_KEY = `spending-tracker:${STORAGE_VERSION}:entries`;

export function loadCategories(): string[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) return [...DEFAULT_CATEGORIES];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...DEFAULT_CATEGORIES];

    const custom = parsed.filter(
      (item): item is string => typeof item === "string" && item.trim() !== "",
    );

    return mergeCategories(custom);
  } catch {
    return [...DEFAULT_CATEGORIES];
  }
}

export function saveCategories(categories: string[]): void {
  try {
    const custom = categories.filter(
      (cat) => !(DEFAULT_CATEGORIES as readonly string[]).includes(cat),
    );
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(custom));
  } catch {
    // localStorage unavailable (private browsing, quota, etc.)
  }
}

export function loadEntries(): SpendingEntry[] {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isValidEntry);
  } catch {
    return [];
  }
}

export function saveEntries(entries: SpendingEntry[]): void {
  try {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  } catch {
    // localStorage unavailable
  }
}

export function mergeCategories(custom: string[]): string[] {
  const seen = new Set<string>();
  const merged: string[] = [];

  for (const cat of [...DEFAULT_CATEGORIES, ...custom]) {
    const trimmed = cat.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    merged.push(trimmed);
  }

  return merged.sort((a, b) => a.localeCompare(b));
}

function isValidEntry(value: unknown): value is SpendingEntry {
  if (typeof value !== "object" || value === null) return false;

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === "string" &&
    typeof entry.category === "string" &&
    typeof entry.amount === "number" &&
    entry.amount > 0 &&
    typeof entry.createdAt === "string"
  );
}
