"use client";

import { useCallback, useSyncExternalStore } from "react";
import { NOTES_STORAGE_KEY, type Note } from "@/types/note";

function parseNotes(raw: string | null): Note[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is Note =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.text === "string" &&
        typeof item.createdAt === "number",
    );
  } catch {
    return [];
  }
}

let notesCache: Note[] | null = null;
const listeners = new Set<() => void>();
const EMPTY_NOTES: Note[] = [];

function getSnapshot(): Note[] {
  if (typeof window !== "undefined" && notesCache === null) {
    notesCache = parseNotes(localStorage.getItem(NOTES_STORAGE_KEY));
  }

  return notesCache ?? EMPTY_NOTES;
}

function getServerSnapshot(): Note[] {
  return EMPTY_NOTES;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function persist(nextNotes: Note[]) {
  notesCache = nextNotes;

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(nextNotes));
    } catch {
      // QuotaExceededError, private browsing, or disabled storage — keep in-memory state
    }
  }

  listeners.forEach((listener) => listener());
}

export function useNotes() {
  const notes = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addNote = useCallback((text: string): boolean => {
    const trimmed = text.trim();
    if (!trimmed) return false;

    persist([
      ...getSnapshot(),
      { id: crypto.randomUUID(), text: trimmed, createdAt: Date.now() },
    ]);
    return true;
  }, []);

  const updateNote = useCallback((id: string, text: string): boolean => {
    const trimmed = text.trim();
    if (!trimmed) return false;

    persist(
      getSnapshot().map((note) =>
        note.id === id ? { ...note, text: trimmed } : note,
      ),
    );
    return true;
  }, []);

  const deleteNote = useCallback((id: string) => {
    persist(getSnapshot().filter((note) => note.id !== id));
  }, []);

  return { notes, addNote, updateNote, deleteNote };
}
