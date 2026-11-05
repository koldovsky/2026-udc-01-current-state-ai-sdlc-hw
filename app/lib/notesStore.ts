export type Note = {
  id: string;
  text: string;
};

const STORAGE_KEY = "notes:v1";

const listeners = new Set<() => void>();

// Заповнюється лише в браузері: на сервері React викликає getServerSnapshot.
let cachedNotes: Note[] | null = null;

function isNote(value: unknown): value is Note {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const { id, text } = value as Record<string, unknown>;
  return typeof id === "string" && typeof text === "string";
}

function readNotes(): Note[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.every(isNote) ? parsed : [];
  } catch {
    return [];
  }
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function saveNotes(notes: Note[]) {
  cachedNotes = notes;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // Без доступу до сховища нотатки живуть у пам'яті до перезавантаження.
  }

  notifyListeners();
}

function handleStorageChange(event: StorageEvent) {
  // key === null означає, що сховище повністю очистили.
  if (event.key === STORAGE_KEY || event.key === null) {
    cachedNotes = readNotes();
    notifyListeners();
  }
}

export function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    window.addEventListener("storage", handleStorageChange);
  }
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", handleStorageChange);
    }
  };
}

export function getSnapshot(): Note[] {
  cachedNotes ??= readNotes();
  return cachedNotes;
}

export function getServerSnapshot(): null {
  return null;
}

export function addNote(text: string) {
  saveNotes([{ id: crypto.randomUUID(), text }, ...getSnapshot()]);
}

export function deleteNote(id: string) {
  saveNotes(getSnapshot().filter((note) => note.id !== id));
}
