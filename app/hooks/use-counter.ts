"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "counter";
const INITIAL_VALUE = 0;

// Module-level store — client only (this file is "use client")
let _value = INITIAL_VALUE;
let _initialized = false;
const _listeners = new Set<() => void>();

function _emit() {
  _listeners.forEach((l) => l());
}

function _load(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return INITIAL_VALUE;
    const parsed = parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : INITIAL_VALUE;
  } catch {
    return INITIAL_VALUE;
  }
}

function _save(value: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // localStorage unavailable (e.g. private browsing) — silently ignore
  }
}

function _subscribe(listener: () => void): () => void {
  // Initialize from localStorage on first subscription (client only)
  if (!_initialized && typeof window !== "undefined") {
    _value = _load();
    _initialized = true;
  }
  _listeners.add(listener);
  return () => _listeners.delete(listener);
}

function _getSnapshot(): number {
  return _value;
}

function _getServerSnapshot(): number {
  return INITIAL_VALUE;
}

export function useCounter() {
  const value = useSyncExternalStore(_subscribe, _getSnapshot, _getServerSnapshot);

  const increment = useCallback(() => {
    _value = _value + 1;
    _save(_value);
    _emit();
  }, []);

  const decrement = useCallback(() => {
    _value = Math.max(0, _value - 1);
    _save(_value);
    _emit();
  }, []);

  const reset = useCallback(() => {
    _value = 0;
    _save(_value);
    _emit();
  }, []);

  return { value, increment, decrement, reset };
}
