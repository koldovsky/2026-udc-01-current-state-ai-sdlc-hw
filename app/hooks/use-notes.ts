"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Note } from "@/types/note";

const STORAGE_KEY = "notes";

// Module-level store — client only (this file is "use client")
const EMPTY: Note[] = [];
let _notes: Note[] = [];
let _initialized = false;
const _listeners = new Set<() => void>();

function _emit() {
  _listeners.forEach((l) => l());
}

function _load(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Note[]) : [];
  } catch {
    return [];
  }
}

function _save(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // localStorage unavailable (e.g. private browsing) — silently ignore
  }
}

function _sort(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => {
    if (a.important !== b.important) return a.important ? -1 : 1;
    return b.createdAt - a.createdAt;
  });
}

function _subscribe(listener: () => void): () => void {
  // Initialize from localStorage on first subscription (client only)
  if (!_initialized && typeof window !== "undefined") {
    _notes = _load();
    _initialized = true;
  }
  _listeners.add(listener);
  return () => _listeners.delete(listener);
}

function _getSnapshot(): Note[] {
  return _notes;
}

function _getServerSnapshot(): Note[] {
  return EMPTY;
}

export function useNotes() {
  const notes = useSyncExternalStore(_subscribe, _getSnapshot, _getServerSnapshot);

  const addNote = useCallback((title: string) => {
    const note: Note = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      important: false,
      createdAt: Date.now(),
    };
    _notes = _sort([..._notes, note]);
    _save(_notes);
    _emit();
  }, []);

  const deleteNote = useCallback((id: string) => {
    _notes = _notes.filter((n) => n.id !== id);
    _save(_notes);
    _emit();
  }, []);

  const toggleCompleted = useCallback((id: string) => {
    // No re-sort needed: completed status does not affect sort order
    _notes = _notes.map((n) => (n.id === id ? { ...n, completed: !n.completed } : n));
    _save(_notes);
    _emit();
  }, []);

  const toggleImportant = useCallback((id: string) => {
    _notes = _sort(_notes.map((n) => (n.id === id ? { ...n, important: !n.important } : n)));
    _save(_notes);
    _emit();
  }, []);

  return { notes, addNote, deleteNote, toggleCompleted, toggleImportant };
}
